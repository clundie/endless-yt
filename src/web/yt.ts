import { decodeYTHash } from "./yt-hash";
import { YTMessage } from "./yt-message";

const YOUTUBE_IFRAME_API_HREF = "https://www.youtube.com/iframe_api";

function ytMain() {
  const ytOptions = decodeYTHash(document.location.hash);
  if (ytOptions == null) {
    return;
  }
  const appElement = document.getElementById("app");
  if (appElement == null) {
    return;
  }
  window.onYouTubeIframeAPIReady = function onYouTubeIframeAPIReady() {
    const player = new YT.Player(appElement, {
      videoId: ytOptions.videoId,
      width: "100%",
      height: "100%",
      playerVars: {
        autohide: 1,
        autoplay: 0,
        playsinline: 1,
        controls: 1,
        enablejsapi: 1,
        fs: 1,
        iv_load_policy: 3,
        origin: document.location.origin,
        modestbranding: 1,
        showinfo: 0,
        rel: 0,
      },
    });
    player.addEventListener("onReady", function (event) {
      window.parent.postMessage(
        {
          source: "endless-yt",
          payload: {
            duration: event.target.getDuration(),
          },
        } satisfies YTMessage,
        import.meta.env.VITE_PARENT_ORIGIN,
      );
    });
  };
  const tag = document.createElement("script");
  tag.src = YOUTUBE_IFRAME_API_HREF;
  const firstScriptTag = document.getElementsByTagName("script")[0];
  firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
}

ytMain();

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
  }
}
