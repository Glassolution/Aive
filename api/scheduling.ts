import { handleSchedulingRequest } from "../src/lib/scheduling/http";

export default async function handler(req: any, res: any) {
  const protocol = req.headers["x-forwarded-proto"] ?? "https";
  const host = req.headers.host ?? "localhost";
  const body = req.method === "GET" || req.method === "HEAD" ? undefined : JSON.stringify(req.body ?? {});
  const request = new Request(`${protocol}://${host}${req.url ?? "/api/scheduling"}`, {
    method: req.method,
    headers: req.headers as HeadersInit,
    body,
  });
  const response = await handleSchedulingRequest(request);

  res.status(response.status);
  response.headers.forEach((value, key) => res.setHeader(key, value));
  res.send(await response.text());
}
