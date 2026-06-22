import { handleSchedulingRequest } from "../src/lib/scheduling/http";

function toRequestHeaders(headers: Record<string, string | string[] | undefined>) {
  const requestHeaders = new Headers();

  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") {
      requestHeaders.set(key, value);
    } else if (Array.isArray(value)) {
      requestHeaders.set(key, value.join(", "));
    }
  }

  if (!requestHeaders.has("content-type")) {
    requestHeaders.set("content-type", "application/json");
  }

  return requestHeaders;
}

export default async function handler(req: any, res: any) {
  try {
    const protocol = req.headers["x-forwarded-proto"] ?? "https";
    const host = req.headers.host ?? "localhost";
    const body = req.method === "GET" || req.method === "HEAD" ? undefined : JSON.stringify(req.body ?? {});
    const request = new Request(`${protocol}://${host}${req.url ?? "/api/scheduling"}`, {
      method: req.method,
      headers: toRequestHeaders(req.headers ?? {}),
      body,
    });
    const response = await handleSchedulingRequest(request);

    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    res.send(await response.text());
  } catch (error) {
    console.error("Erro na API de agendamento:", error);
    res.status(500).json({
      ok: false,
      error: "scheduling_api_error",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
