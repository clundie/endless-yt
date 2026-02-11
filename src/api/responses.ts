export function notFound() {
  return new Response("", {
    status: 404,
    statusText: "Not Found",
  });
}

export function forbidden() {
  return new Response("", {
    status: 403,
    statusText: "Forbidden",
  });
}
