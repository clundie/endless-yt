export interface YTMessage {
  source: "endless-yt";
  payload: YTPayload;
}

export type YTPayload = YTReadyPayload;

export interface YTReadyPayload {
  type: "ready";
}

export function isYTMessage(obj: unknown): obj is YTMessage {
  return (
    obj != null &&
    typeof obj === "object" &&
    "source" in obj &&
    obj.source === "endless-yt" &&
    "payload" in obj &&
    isYTUnknownPayload(obj.payload) &&
    isYTReadyPayload(obj.payload)
  );
}

interface YTUnknownPayload {
  type: string;
}

function isYTUnknownPayload(obj: unknown): obj is YTUnknownPayload {
  return (
    obj != null &&
    typeof obj === "object" &&
    "type" in obj &&
    typeof obj.type === "string"
  );
}

function isYTReadyPayload(obj: YTUnknownPayload): obj is YTReadyPayload {
  return obj.type === "ready";
}
