import { decodeYTHash } from "./yt-hash";
import { YTMessage } from "./yt-message";
import { isYTParentMessage } from "./yt-parent-message";

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

    window.addEventListener("message", function onMessage(event) {
      if (
        !event.isTrusted ||
        event.origin !== import.meta.env.VITE_PARENT_ORIGIN ||
        !isYTParentMessage(event.data)
      ) {
        return;
      }
      console.log("%o", event.data.payload);
    });

    player.addEventListener("onReady", onReady.bind(player));
    function onReady(this: typeof player) {
      this.removeEventListener("onReady", onReady);
      window.parent.postMessage(
        {
          source: "endless-yt",
          payload: {
            type: "ready",
          },
        } satisfies YTMessage,
        import.meta.env.VITE_PARENT_ORIGIN,
      );
    }
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
