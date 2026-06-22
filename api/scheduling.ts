export const config = {
  runtime: "nodejs",
};

const schedulingConfig = {
  timezone: "America/Sao_Paulo",
  weekdays: [1, 2, 3, 4, 5],
  workdayStartHour: 9,
  workdayEndHour: 18,
  slotDurationMinutes: 45,
  minimumNoticeMinutes: 120,
  daysToShow: 21,
};

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: schedulingConfig.timezone,
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: schedulingConfig.timezone,
  hour: "2-digit",
  minute: "2-digit",
});

function parseEmailList(value: string) {
  return value
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

function zonedParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: schedulingConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return {
    year: get("year"),
    month: get("month"),
    day: get("day"),
    hour: get("hour"),
    minute: get("minute"),
  };
}

function zonedDateKey(date: Date) {
  const parts = zonedParts(date);
  return `${parts.year}-${String(parts.month).padStart(2, "0")}-${String(parts.day).padStart(2, "0")}`;
}

function zonedLocalToUtc(year: number, month: number, day: number, hour: number, minute: number) {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const actual = zonedParts(guess);
  const wantedUtc = Date.UTC(year, month - 1, day, hour, minute);
  const actualUtc = Date.UTC(actual.year, actual.month - 1, actual.day, actual.hour, actual.minute);
  return new Date(guess.getTime() + wantedUtc - actualUtc);
}

function addDaysInZone(date: Date, days: number) {
  const parts = zonedParts(date);
  return zonedLocalToUtc(parts.year, parts.month, parts.day + days, 0, 0);
}

function weekdayNumber(date: Date) {
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: schedulingConfig.timezone,
    weekday: "short",
  }).format(date);
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(weekday);
}

function hasPostgresEnv() {
  return Boolean(process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL);
}

async function ensurePostgresTable() {
  const { sql } = await import("@vercel/postgres");
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      topic TEXT,
      start_at TIMESTAMPTZ NOT NULL UNIQUE,
      end_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

async function listBookedStartTimes() {
  if (!hasPostgresEnv()) return [];

  await ensurePostgresTable();
  const { sql } = await import("@vercel/postgres");
  const { rows } = await sql`
    SELECT start_at
    FROM bookings
    WHERE start_at >= NOW()
    ORDER BY start_at ASC;
  `;
  return rows.map((row) => new Date(String(row.start_at)).toISOString());
}

function isAllowedSlot(startAt: string, now = new Date()) {
  const start = new Date(startAt);
  if (Number.isNaN(start.getTime())) return false;

  const parts = zonedParts(start);
  const minimumStart = now.getTime() + schedulingConfig.minimumNoticeMinutes * 60_000;

  return (
    schedulingConfig.weekdays.includes(weekdayNumber(start)) &&
    (parts.hour * 60 + parts.minute - schedulingConfig.workdayStartHour * 60) %
      schedulingConfig.slotDurationMinutes ===
      0 &&
    parts.hour >= schedulingConfig.workdayStartHour &&
    start.getTime() >= minimumStart &&
    start.getTime() + schedulingConfig.slotDurationMinutes * 60_000 <=
      zonedLocalToUtc(parts.year, parts.month, parts.day, schedulingConfig.workdayEndHour, 0).getTime()
  );
}

async function generateAvailableSlots() {
  const booked = new Set(await listBookedStartTimes());
  const days: Array<{
    date: string;
    label: string;
    slots: Array<{ startAt: string; endAt: string; dateLabel: string; timeLabel: string }>;
  }> = [];
  const now = new Date();
  const minimumStart = now.getTime() + schedulingConfig.minimumNoticeMinutes * 60_000;

  for (let offset = 0; offset < schedulingConfig.daysToShow; offset += 1) {
    const day = addDaysInZone(now, offset);
    const dayParts = zonedParts(day);
    if (!schedulingConfig.weekdays.includes(weekdayNumber(day))) continue;

    const slots = [];
    const endOfDay = zonedLocalToUtc(
      dayParts.year,
      dayParts.month,
      dayParts.day,
      schedulingConfig.workdayEndHour,
      0,
    ).getTime();

    for (
      let minutes = schedulingConfig.workdayStartHour * 60;
      minutes + schedulingConfig.slotDurationMinutes <= schedulingConfig.workdayEndHour * 60;
      minutes += schedulingConfig.slotDurationMinutes
    ) {
      const start = zonedLocalToUtc(
        dayParts.year,
        dayParts.month,
        dayParts.day,
        Math.floor(minutes / 60),
        minutes % 60,
      );
      const end = new Date(start.getTime() + schedulingConfig.slotDurationMinutes * 60_000);

      if (start.getTime() < minimumStart || end.getTime() > endOfDay) continue;
      if (booked.has(start.toISOString())) continue;

      slots.push({
        startAt: start.toISOString(),
        endAt: end.toISOString(),
        dateLabel: dateFormatter.format(start).replace(".", ""),
        timeLabel: timeFormatter.format(start),
      });
    }

    if (slots.length > 0) {
      days.push({
        date: zonedDateKey(day),
        label: dateFormatter.format(day).replace(".", ""),
        slots,
      });
    }
  }

  return {
    timezone: schedulingConfig.timezone,
    slotDurationMinutes: schedulingConfig.slotDurationMinutes,
    minimumNoticeMinutes: schedulingConfig.minimumNoticeMinutes,
    days,
  };
}

function validateBooking(input: any) {
  const name = typeof input?.name === "string" ? input.name.trim() : "";
  const email = typeof input?.email === "string" ? input.email.trim() : "";
  const startAt = typeof input?.startAt === "string" ? input.startAt : "";

  if (name.length < 2 || name.length > 120) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) return null;
  if (!isAllowedSlot(startAt)) return null;

  return { name, email, startAt };
}

async function createBooking(input: { name: string; email: string; startAt: string }) {
  const endAt = new Date(new Date(input.startAt).getTime() + schedulingConfig.slotDurationMinutes * 60_000);
  const booking = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    topic: null,
    startAt: input.startAt,
    endAt: endAt.toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (!hasPostgresEnv()) return booking;

  await ensurePostgresTable();
  const { sql } = await import("@vercel/postgres");
  const { rows } = await sql`
    INSERT INTO bookings (id, name, email, topic, start_at, end_at)
    VALUES (${booking.id}, ${booking.name}, ${booking.email}, null, ${booking.startAt}, ${booking.endAt})
    ON CONFLICT (start_at) DO NOTHING
    RETURNING id;
  `;

  return rows[0] ? booking : null;
}

async function sendBookingEmails(booking: { name: string; email: string; startAt: string }) {
  if (!process.env.RESEND_API_KEY) return "skipped";

  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const data = new Intl.DateTimeFormat("pt-BR", {
    timeZone: schedulingConfig.timezone,
    dateStyle: "full",
  }).format(new Date(booking.startAt));
  const horario = timeFormatter.format(new Date(booking.startAt));
  const ownerEmail = parseEmailList(
    process.env.SCHEDULING_OWNER_EMAIL ?? "lucassrby@gmail.com,xavierluisfelipe17@gmail.com",
  );
  const from = process.env.RESEND_FROM_EMAIL ?? "Aive <agenda@aive.work>";
  const html = `<div style="font-family:Arial,sans-serif"><h1>Call confirmada</h1><p>Oi ${booking.name}, sua call com a Aive esta confirmada para ${data} as ${horario}.</p></div>`;

  await resend.emails.send({
    from,
    to: booking.email,
    replyTo: ownerEmail,
    subject: "Sua call com a Aive esta confirmada",
    html,
    text: `Oi ${booking.name}, sua call com a Aive esta confirmada para ${data} as ${horario}.`,
  });

  await resend.emails.send({
    from,
    to: ownerEmail,
    subject: "Nova call marcada - Aive",
    html: `<div style="font-family:Arial,sans-serif"><h1>Nova call marcada</h1><p>${booking.name} (${booking.email}) marcou para ${data} as ${horario}.</p></div>`,
    text: `${booking.name} (${booking.email}) marcou para ${data} as ${horario}.`,
  });

  return "sent";
}

export default async function handler(req: any, res: any) {
  try {
    if (req.method === "GET") {
      return res.status(200).json(await generateAvailableSlots());
    }

    if (req.method === "POST") {
      const parsed = validateBooking(req.body);
      if (!parsed) return res.status(400).json({ ok: false, error: "invalid" });

      const booking = await createBooking(parsed);
      if (!booking) return res.status(409).json({ ok: false, error: "unavailable" });

      const emailStatus = await sendBookingEmails(booking);
      return res.status(201).json({ ok: true, booking, emailStatus });
    }

    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "method_not_allowed" });
  } catch (error) {
    console.error("Erro na API de agendamento:", error);
    return res.status(500).json({
      ok: false,
      error: "scheduling_api_error",
      message: error instanceof Error ? error.message : "Erro desconhecido",
    });
  }
}
