import { YTReadyMessage } from "./yt-message";
import {
  isYTParentNowPlayingMessage,
  isYTParentUnknownMessage,
} from "./yt-parent-message";

const YOUTUBE_IFRAME_API_HREF = "https://www.youtube.com/iframe_api";

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
  }
}

ytMain();

async function ytMain(): Promise<void> {
  const appElement = document.getElementById("app");
  if (appElement == null) {
    return;
  }
  const player = await loadYTPlayer(appElement);

  appElement.classList.remove("invisible");

  window.addEventListener("message", function onMessage(event) {
    if (
      !event.isTrusted ||
      event.origin !== import.meta.env.VITE_PARENT_ORIGIN ||
      !isYTParentUnknownMessage(event.data)
    ) {
      return;
    }
    if (isYTParentNowPlayingMessage(event.data)) {
      const video = event.data.payload.video;
      if (video != null) {
        console.log(Date.now());
        console.log(video.startTimestampMilliseconds);
        player.loadVideoById(
          video.ytVideoId,
          video.startSeekSeconds +
            Math.max((Date.now() - video.startTimestampMilliseconds) / 1000, 0),
        );
      } else {
        player.stopVideo();
      }
    }
  });

  window.parent.postMessage(
    {
      source: "endless-yt",
      payload: {
        type: "ready",
      },
    } satisfies YTReadyMessage,
    import.meta.env.VITE_PARENT_ORIGIN,
  );

  logPlayerState(player);
  player.addEventListener("onStateChange", function onStateChange(event) {
    logPlayerState(event.target);
  });
}

function loadYTPlayer(parentElement: HTMLElement): Promise<YT.Player> {
  return new Promise<YT.Player>(function (resolve) {
    const ytElement = document.createElement("div");
    parentElement.appendChild(ytElement);
    window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
      delete window.onYouTubeIframeAPIReady;
      const player = new YT.Player(ytElement, {
        width: "100%",
        height: "100%",
        playerVars: {
          autohide: 1,
          autoplay: 0,
          playsinline: 1,
          controls: 0,
          enablejsapi: 1,
          fs: 1,
          iv_load_policy: 3,
          origin: document.location.origin,
          modestbranding: 1,
          showinfo: 0,
          rel: 0,
        },
      });
      player.addEventListener("onReady", function onReady(event) {
        event.target.removeEventListener("onReady", onReady);
        resolve(event.target);
      });
    };
    const tag = document.createElement("script");
    tag.src = YOUTUBE_IFRAME_API_HREF;
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  });
}

function logPlayerState(player: YT.Player) {
  const playerState = player.getPlayerState();
  if (playerState === 5) {
    console.log("cued");
  } else if (playerState === 1) {
    console.log("playing");
  } else if (playerState === 2) {
    console.log("paused");
  } else if (playerState === 3) {
    console.log("buffering");
  } else if (playerState === 0) {
    console.log("ended");
  } else if (playerState === -1) {
    console.log("unstarted");
  } else {
    console.log(`player state=%s`, playerState);
  }
}
