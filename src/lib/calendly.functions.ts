import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  eventUri: z.string().url().max(500),
  inviteeUri: z.string().url().max(500),
});

// Receives the Calendly event/invitee URIs from the booking embed, fetches the
// full booking details using the Calendly API token, and forwards them to the
// configured Zapier webhook. Runs server-side only — token never reaches the client.
export const notifyBooking = createServerFn({ method: "POST" })
  .inputValidator((data) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const token = process.env.CALENDLY_API_TOKEN;
    const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;

    if (!token || !webhookUrl) {
      console.error("notifyBooking: missing CALENDLY_API_TOKEN or ZAPIER_WEBHOOK_URL");
      return { success: false, error: "config" as const };
    }

    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [inviteeRes, eventRes] = await Promise.all([
        fetch(data.inviteeUri, { headers }),
        fetch(data.eventUri, { headers }),
      ]);

      if (!inviteeRes.ok || !eventRes.ok) {
        console.error(
          "notifyBooking: Calendly fetch failed",
          inviteeRes.status,
          eventRes.status,
        );
        return { success: false, error: "calendly" as const };
      }

      const invitee = ((await inviteeRes.json()) as { resource?: Record<string, unknown> })?.resource ?? {};
      const event = ((await eventRes.json()) as { resource?: Record<string, unknown> })?.resource ?? {};

      // Phone: try text reminder number, then any phone-like Q&A answer.
      let phone = (invitee.text_reminder_number as string | undefined) ?? "";
      const qa = Array.isArray(invitee.questions_and_answers)
        ? (invitee.questions_and_answers as Array<{ question?: string; answer?: string }>)
        : [];
      if (!phone) {
        const phoneQa = qa.find((q) =>
          /phone|telefone|whats|celular|number|tel/i.test(q?.question ?? ""),
        );
        if (phoneQa?.answer) phone = phoneQa.answer;
      }

      const payload = {
        nome: (invitee.name as string | undefined) ?? "",
        email: (invitee.email as string | undefined) ?? "",
        telefone: phone,
        data_hora: (event.start_time as string | undefined) ?? "",
        data_hora_fim: (event.end_time as string | undefined) ?? "",
        fuso_horario: (invitee.timezone as string | undefined) ?? "",
        evento: (event.name as string | undefined) ?? "",
      };

      const zapRes = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!zapRes.ok) {
        console.error("notifyBooking: Zapier webhook failed", zapRes.status);
        return { success: false, error: "zapier" as const };
      }

      return { success: true as const };
    } catch (err) {
      console.error("notifyBooking: unexpected error", err);
      return { success: false, error: "exception" as const };
    }
  });