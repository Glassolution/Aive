import { z } from "zod";
import { sendBookingEmails } from "./email";
import { generateAvailableSlots, isAllowedSlot } from "./slots";
import { createBooking, listBookedStartTimes } from "./storage";
import type { CreateBookingResult } from "./types";

export const bookingInputSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(180),
  topic: z.string().trim().max(180).optional(),
  startAt: z.string().datetime(),
});

export async function getSchedulingSlots() {
  const bookedStartTimes = await listBookedStartTimes();
  return generateAvailableSlots(bookedStartTimes);
}

export async function bookSchedulingSlot(rawInput: unknown): Promise<CreateBookingResult> {
  const parsed = bookingInputSchema.safeParse(rawInput);
  if (!parsed.success || !isAllowedSlot(parsed.data.startAt)) {
    return { ok: false, error: "invalid" };
  }

  try {
    const bookedStartTimes = await listBookedStartTimes();
    if (bookedStartTimes.includes(parsed.data.startAt)) {
      return { ok: false, error: "unavailable" };
    }

    const booking = await createBooking(parsed.data);
    if (!booking) {
      return { ok: false, error: "unavailable" };
    }

    const emailStatus = await sendBookingEmails(booking);
    return { ok: true, booking, emailStatus };
  } catch (error) {
    console.error("Falha ao criar agendamento:", error);
    return { ok: false, error: "storage" };
  }
}

