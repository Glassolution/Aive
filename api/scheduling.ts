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
  daysToShow: 60,
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderTemplate(template: string, values: Record<string, string>, rawKeys: string[] = []) {
  return Object.entries(values).reduce((rendered, [key, value]) => {
    const renderedValue = rawKeys.includes(key) ? value : escapeHtml(value);
    return rendered.replaceAll(`{{${key}}}`, renderedValue);
  }, template);
}

async function loadOwnerNotificationTemplate() {
  try {
    const [{ readFile }, path] = await Promise.all([import("node:fs/promises"), import("node:path")]);
    return readFile(path.join(process.cwd(), "emails", "booking-owner-notification.html"), "utf8");
  } catch (error) {
    console.warn("Template de aviso interno nao encontrado; usando fallback simples.", error);
    return "";
  }
}

function compactCalendarDate(isoDate: string) {
  return isoDate.replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z");
}

function createCalendarLink(booking: { startAt: string; endAt?: string }) {
  const start = compactCalendarDate(booking.startAt);
  const end = compactCalendarDate(
    booking.endAt ?? new Date(new Date(booking.startAt).getTime() + schedulingConfig.slotDurationMinutes * 60_000).toISOString(),
  );
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Call com a Aive",
    dates: `${start}/${end}`,
    details: "Call estrategica com a Aive. O link da reuniao sera enviado antes do horario.",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function renderQuestionnaireTemplate(
  questionnaire: Array<{ id: number; categoria: string; pergunta: string; resposta: string }>,
) {
  const answeredQuestions = questionnaire.filter((item) => item.resposta);
  if (!answeredQuestions.length) {
    return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #262626;border-radius:14px;overflow:hidden;">
      <tr><td bgcolor="#0A0A0A" style="background-color:#0A0A0A;padding:10px;text-align:center;"><span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#FFFFFF;text-transform:uppercase;">Questionario</span></td></tr>
      <tr><td style="padding:20px 24px;"><p style="margin:0;font-size:14px;line-height:1.6;color:#9A9A9A;">Nenhuma resposta preenchida.</p></td></tr>
    </table>`;
  }

  const topics = Array.from(new Set(answeredQuestions.map((item) => item.categoria)));
  const topicRows = topics
    .map((topic) => {
      const rows = answeredQuestions
        .filter((item) => item.categoria === topic)
        .map(
          (item) => `<tr>
            <td style="padding:12px 0;border-top:1px solid #262626;">
              <p style="margin:0;font-size:13px;line-height:1.45;color:#FFFFFF;font-weight:700;">${escapeHtml(item.pergunta)}</p>
              <p style="margin:6px 0 0 0;font-size:14px;line-height:1.55;color:#C9C9C9;">${escapeHtml(item.resposta)}</p>
            </td>
          </tr>`,
        )
        .join("");

      return `<tr>
        <td style="padding:18px 24px 4px 24px;">
          <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:1.5px;color:#FF8A2B;text-transform:uppercase;">${escapeHtml(topic)}</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${rows}</table>
        </td>
      </tr>`;
    })
    .join("");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #262626;border-radius:14px;overflow:hidden;">
    <tr><td bgcolor="#0A0A0A" style="background-color:#0A0A0A;padding:10px;text-align:center;"><span style="font-size:11px;font-weight:700;letter-spacing:2px;color:#FFFFFF;text-transform:uppercase;">Questionario</span></td></tr>
    ${topicRows}
  </table>`;
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
  const company = typeof input?.company === "string" ? input.company.trim().slice(0, 180) : "";
  const website = typeof input?.website === "string" ? input.website.trim().slice(0, 220) : "";
  const service = typeof input?.service === "string" ? input.service.trim().slice(0, 180) : "";
  const volume = typeof input?.volume === "string" ? input.volume.trim().slice(0, 180) : "";
  const questionnaire = Array.isArray(input?.questionnaire)
    ? input.questionnaire
        .map((item: any) => ({
          id: Number(item?.id) || 0,
          categoria: typeof item?.categoria === "string" ? item.categoria.trim().slice(0, 80) : "",
          pergunta: typeof item?.pergunta === "string" ? item.pergunta.trim().slice(0, 240) : "",
          resposta: typeof item?.resposta === "string" ? item.resposta.trim().slice(0, 600) : "",
        }))
        .filter((item) => item.id > 0 && item.categoria && item.pergunta)
        .slice(0, 12)
    : [];

  if (name.length < 2 || name.length > 120) return null;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) return null;
  if (!isAllowedSlot(startAt)) return null;

  return { name, email, startAt, company, website, service, volume, questionnaire };
}

async function createBooking(input: {
  name: string;
  email: string;
  startAt: string;
  company?: string;
  website?: string;
  service?: string;
  volume?: string;
  questionnaire?: Array<{ id: number; categoria: string; pergunta: string; resposta: string }>;
}) {
  const endAt = new Date(new Date(input.startAt).getTime() + schedulingConfig.slotDurationMinutes * 60_000);
  const questionnaireSummary = (input.questionnaire ?? [])
    .filter((item) => item.resposta)
    .map((item) => `${item.categoria} - ${item.pergunta}: ${item.resposta}`)
    .join(" | ");
  const topic = [questionnaireSummary, input.company, input.website, input.service, input.volume]
    .filter(Boolean)
    .join(" | ")
    .slice(0, 900);
  const booking = {
    id: crypto.randomUUID(),
    name: input.name,
    email: input.email,
    topic,
    company: input.company ?? "",
    website: input.website ?? "",
    service: input.service ?? "",
    volume: input.volume ?? "",
    questionnaire: input.questionnaire ?? [],
    startAt: input.startAt,
    endAt: endAt.toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (!hasPostgresEnv()) return booking;

  await ensurePostgresTable();
  const { sql } = await import("@vercel/postgres");
  const { rows } = await sql`
    INSERT INTO bookings (id, name, email, topic, start_at, end_at)
    VALUES (${booking.id}, ${booking.name}, ${booking.email}, ${booking.topic || null}, ${booking.startAt}, ${booking.endAt})
    ON CONFLICT (start_at) DO NOTHING
    RETURNING id;
  `;

  return rows[0] ? booking : null;
}

async function sendBookingEmails(booking: {
  name: string;
  email: string;
  startAt: string;
  company?: string;
  website?: string;
  service?: string;
  volume?: string;
  questionnaire?: Array<{ id: number; categoria: string; pergunta: string; resposta: string }>;
}) {
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
  const meetLink = process.env.GOOGLE_MEET_LINK ?? "https://meet.google.com/";
  const calendarLink = createCalendarLink(booking);
  const companyDetailsText = [
    booking.company ? `Empresa: ${booking.company}` : "",
    booking.website ? `Site/Instagram: ${booking.website}` : "",
    booking.service ? `Serviço principal: ${booking.service}` : "",
    booking.volume ? `Volume atual: ${booking.volume}` : "",
  ]
    .filter(Boolean)
    .join("\n");
  const companyDetailsHtml = [
    booking.company ? `<li><strong>Empresa:</strong> ${booking.company}</li>` : "",
    booking.website ? `<li><strong>Site/Instagram:</strong> ${booking.website}</li>` : "",
    booking.service ? `<li><strong>Serviço principal:</strong> ${booking.service}</li>` : "",
    booking.volume ? `<li><strong>Volume atual:</strong> ${booking.volume}</li>` : "",
  ]
    .filter(Boolean)
    .join("");
  const questionnaireText = (booking.questionnaire ?? [])
    .filter((item) => item.resposta)
    .map((item) => `- [${item.categoria}] ${item.pergunta}: ${item.resposta}`)
    .join("\n");
  const questionnaireHtml = (booking.questionnaire ?? [])
    .filter((item) => item.resposta)
    .map(
      (item) =>
        `<li><strong>[${item.categoria}] ${item.pergunta}</strong><br/><span>${item.resposta}</span></li>`,
    )
    .join("");
  const questionnaireTemplateHtml = renderQuestionnaireTemplate(booking.questionnaire ?? []);
  const ownerTemplate = await loadOwnerNotificationTemplate();
  let ownerHtml = ownerTemplate
    ? renderTemplate(
        ownerTemplate,
        {
          nome: booking.name,
          email: booking.email,
          data,
          horario,
          duracao: `${schedulingConfig.slotDurationMinutes} minutos`,
          calendar_link: calendarLink,
          questionario: questionnaireTemplateHtml,
        },
        ["questionario"],
      )
    : [
        '<div style="font-family:Arial,sans-serif">',
        "<h1>Nova call marcada</h1>",
        `<p>${escapeHtml(booking.name)} (${escapeHtml(booking.email)}) marcou para ${escapeHtml(data)} as ${escapeHtml(horario)}.</p>`,
        companyDetailsHtml ? `<h2>Dados da empresa</h2><ul>${companyDetailsHtml}</ul>` : "",
        questionnaireHtml ? `<h2>Questionario</h2><ul>${questionnaireHtml}</ul>` : "",
        `<p>Google Meet: <a href="${meetLink}">${meetLink}</a></p>`,
        "</div>",
      ].join("");
  ownerHtml = ownerHtml.replaceAll("{{questionario}}", questionnaireTemplateHtml);
  const html = `<div style="font-family:Arial,sans-serif"><h1>Call confirmada</h1><p>Oi ${booking.name}, sua call com a Aive está confirmada para ${data} às ${horario}.</p><p>Google Meet: <a href="${meetLink}">${meetLink}</a></p></div>`;

  await resend.emails.send({
    from,
    to: booking.email,
    replyTo: ownerEmail,
    subject: "Sua call com a Aive está confirmada",
    html,
    text: `Oi ${booking.name}, sua call com a Aive está confirmada para ${data} às ${horario}.\nGoogle Meet: ${meetLink}`,
  });

  await resend.emails.send({
    from,
    to: ownerEmail,
    subject: "Nova call marcada - Aive",
    html: ownerHtml,
    text: `${booking.name} (${booking.email}) marcou para ${data} as ${horario}.${companyDetailsText ? `\n\nDados da empresa:\n${companyDetailsText}` : ""}${questionnaireText ? `\n\nQuestionario:\n${questionnaireText}` : ""}\nGoogle Meet: ${meetLink}\nAdicionar ao calendario: ${calendarLink}`,
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
