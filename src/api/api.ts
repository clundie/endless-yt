import * as Responses from "./responses";

export default {
  async fetch(request, env): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;
    if (pathname === "/") {
      if (request.method === "GET") {
        const response = await env.ASSETS?.fetch(request);
        if (
          (request.headers.has("Sec-Fetch-Dest") &&
            request.headers.get("Sec-Fetch-Dest") !== "iframe") ||
          (request.headers.has("Sec-Fetch-Mode") &&
            request.headers.get("Sec-Fetch-Mode") !== "navigate")
        ) {
          return Responses.forbidden();
        }
        if (response === undefined) {
          return Responses.notFound();
        }
        const headers = new Headers(response.headers);
        headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
        headers.set(
          "Content-Security-Policy",
          `default-src 'self';base-uri 'self';font-src 'none';form-action 'none';frame-ancestors ${env.PARENT_ORIGIN};img-src 'self' data:;object-src 'none';script-src-attr 'none';script-src 'self' https://www.youtube.com${env.UNSAFE_CSP ? " 'unsafe-inline'" : ""};style-src 'self'${env.UNSAFE_CSP ? " 'unsafe-inline'" : ""};frame-src https://www.youtube.com${env.UNSAFE_CSP ? ";worker-src blob:" : ""}`,
        );
        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers,
        });
      } else {
        return Responses.methodNotAllowed();
      }
    } else {
      return Responses.notFound();
    }
  },
} satisfies ExportedHandler<Env>;
