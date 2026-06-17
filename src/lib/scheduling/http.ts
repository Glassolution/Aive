import { bookSchedulingSlot, getSchedulingSlots } from "./service";

export async function handleSchedulingRequest(request: Request) {
  if (request.method === "GET") {
    return Response.json(await getSchedulingSlots());
  }

  if (request.method === "POST") {
    const result = await bookSchedulingSlot(await request.json().catch(() => null));
    return Response.json(result, {
      status: result.ok ? 201 : result.error === "unavailable" ? 409 : 400,
    });
  }

  return Response.json({ ok: false, error: "method_not_allowed" }, { status: 405 });
}

