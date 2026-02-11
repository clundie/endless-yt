export interface YTMessage {
  source: "endless-yt";
  payload?: unknown;
}

export function isYTMessage(obj: unknown): obj is YTMessage {
  return (
    obj != null &&
    typeof obj === "object" &&
    "source" in obj &&
    obj.source === "endless-yt"
  );
}
