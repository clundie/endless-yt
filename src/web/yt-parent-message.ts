export interface YTParentUnknownMessage {
  source: "endless-yt-parent";
  payload: {
    type: string;
  };
}

export type YTParentAnyMessage =
  | YTParentReadyMessage
  | YTParentNowPlayingMessage;

export function isYTParentUnknownMessage(
  obj: unknown,
): obj is YTParentUnknownMessage {
  return (
    obj != null &&
    typeof obj === "object" &&
    "source" in obj &&
    obj.source === "endless-yt-parent" &&
    "payload" in obj &&
    obj.payload != null &&
    typeof obj.payload === "object" &&
    "type" in obj.payload &&
    typeof obj.payload.type === "string"
  );
}

export interface YTParentReadyMessage {
  source: "endless-yt-parent";
  payload: {
    type: "parent-ready";
  };
}

export function isYTParentReadyMessage(
  obj: YTParentUnknownMessage,
): obj is YTParentReadyMessage {
  return obj.payload.type === "parent-ready";
}

export interface YTParentNowPlayingMessage {
  source: "endless-yt-parent";
  payload: {
    type: "now-playing";
    video: {
      ytVideoId: string;
      startSeekSeconds: number;
      startTimestampMilliseconds: number;
    } | null;
  };
}

export function isYTParentNowPlayingMessage(
  obj: YTParentUnknownMessage,
): obj is YTParentNowPlayingMessage {
  return (
    obj.payload.type === "now-playing" &&
    "video" in obj.payload &&
    typeof obj.payload.video === "object" &&
    (obj.payload.video == null ||
      ("ytVideoId" in obj.payload.video &&
        typeof obj.payload.video.ytVideoId === "string" &&
        "startSeekSeconds" in obj.payload.video &&
        Number.isFinite(obj.payload.video.startSeekSeconds) &&
        "startTimestampMilliseconds" in obj.payload.video &&
        Number.isFinite(obj.payload.video.startTimestampMilliseconds)))
  );
}
