export interface YTParentMessage {
  source: "endless-yt-parent";
  payload: YTParentPayload;
}

export type YTParentPayload = YTParentReadyPayload;

export interface YTParentReadyPayload {
  type: "parent-ready";
}

export function isYTParentMessage(obj: unknown): obj is YTParentMessage {
  return (
    obj != null &&
    typeof obj === "object" &&
    "source" in obj &&
    obj.source === "endless-yt-parent" &&
    "payload" in obj &&
    isYTParentUnknownPayload(obj.payload) &&
    isYTParentReadyPayload(obj.payload)
  );
}

interface YTParentUnknownPayload {
  type: string;
}

function isYTParentUnknownPayload(obj: unknown): obj is YTParentUnknownPayload {
  return (
    obj != null &&
    typeof obj === "object" &&
    "type" in obj &&
    typeof obj.type === "string"
  );
}

function isYTParentReadyPayload(
  obj: YTParentUnknownPayload,
): obj is YTParentReadyPayload {
  return obj.type === "parent-ready";
}
