export interface YTUnknownMessage {
  source: "endless-yt";
  payload: {
    type: string;
  };
}

export function isYTUnknownMessage(obj: unknown): obj is YTUnknownMessage {
  return (
    obj != null &&
    typeof obj === "object" &&
    "source" in obj &&
    obj.source === "endless-yt" &&
    "payload" in obj &&
    obj.payload != null &&
    typeof obj.payload === "object" &&
    "type" in obj.payload &&
    typeof obj.payload.type === "string"
  );
}

export interface YTReadyMessage {
  source: "endless-yt";
  payload: {
    type: "ready";
  };
}

export function isYTReadyMessage(obj: YTUnknownMessage): obj is YTReadyMessage {
  return obj.payload.type === "ready";
}
