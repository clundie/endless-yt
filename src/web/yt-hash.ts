export interface YTOptions {
  videoId: string;
}

export function encodeYTHash(obj: YTOptions): string {
  return encodeURIComponent(JSON.stringify(obj));
}

export function decodeYTHash(hash: string): YTOptions | null {
  if (hash.length < 1 || hash[0] !== "#") {
    return null;
  }
  let obj: unknown;
  try {
    obj = JSON.parse(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
  return isYTOptions(obj) ? obj : null;
}

function isYTOptions(obj: unknown): obj is YTOptions {
  return (
    obj != null &&
    typeof obj === "object" &&
    "videoId" in obj &&
    typeof obj.videoId === "string"
  );
}
