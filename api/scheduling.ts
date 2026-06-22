export const config = {
  runtime: "nodejs",
};

export default async function handler(req: any, res: any) {
  try {
    const { bookSchedulingSlot, getSchedulingSlots } = await import("../src/lib/scheduling/service");

    if (req.method === "GET") {
      return res.status(200).json(await getSchedulingSlots());
    }

    if (req.method === "POST") {
      const result = await bookSchedulingSlot(req.body ?? null);
      return res.status(result.ok ? 201 : result.error === "unavailable" ? 409 : 400).json(result);
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  } catch (error) {
    console.error("Erro na API de agendamento:", error);
    return res.status(500).json({
      ok: false,
      error: "scheduling_api_error",
      message: error instanceof Error ? error.message : "Erro desconhecido",
      stack: process.env.NODE_ENV === "production" ? undefined : error instanceof Error ? error.stack : undefined,
    });
  }
}
