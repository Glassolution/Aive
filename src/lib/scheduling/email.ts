import { Resend } from "resend";
import { schedulingConfig } from "./config";
import type { Booking } from "./types";

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: schedulingConfig.timezone,
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: schedulingConfig.timezone,
  hour: "2-digit",
  minute: "2-digit",
});

const internalDateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: schedulingConfig.timezone,
  weekday: "long",
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const replyToEmails = ["lucassrby@gmail.com", "xavierluisfelipe17@gmail.com"];
const fallbackBookingConfirmationTemplate = `
  <p>Oi {{nome}}, sua call com a Aive esta confirmada.</p>
  <p>Data: {{data}}<br>Horario: {{horario}}<br>Duracao: {{duracao}}</p>
  <p><a href="{{calendar_link}}">Adicionar ao calendario</a></p>
`;
const fallbackOwnerNotificationTemplate = `
  <p>Nova call marcada no site da Aive.</p>
  <p>Cliente: {{nome}}<br>E-mail: {{email}}<br>Data: {{data}}<br>Horario: {{horario}}<br>Duracao: {{duracao}}</p>
  <p><a href="{{calendar_link}}">Adicionar ao calendario</a></p>
`;

type ResendEmailResult = Awaited<ReturnType<Resend["emails"]["send"]>>;

function resendResultHasError(result: ResendEmailResult) {
  return Boolean(result.error);
}

async function loadBookingConfirmationTemplate() {
  return Promise.all([import("node:fs/promises"), import("node:url")])
    .then(([fs, url]) => {
      const templatePath = url.fileURLToPath(new URL("../../../emails/booking-confirmation.html", import.meta.url));
      return fs.readFile(templatePath, "utf8");
    })
    .catch((error) => {
      console.warn("Template de confirmacao nao encontrado; usando fallback simples.", error);
      return fallbackBookingConfirmationTemplate;
    });
}

async function loadOwnerNotificationTemplate() {
  return Promise.all([import("node:fs/promises"), import("node:url")])
    .then(([fs, url]) => {
      const templatePath = url.fileURLToPath(new URL("../../../emails/booking-owner-notification.html", import.meta.url));
      return fs.readFile(templatePath, "utf8");
    })
    .catch((error) => {
      console.warn("Template de aviso interno nao encontrado; usando fallback simples.", error);
      return fallbackOwnerNotificationTemplate;
    });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function compactCalendarDate(isoDate: string) {
  return isoDate.replaceAll("-", "").replaceAll(":", "").replace(/\.\d{3}Z$/, "Z");
}

function createCalendarLink(booking: Booking) {
  const start = compactCalendarDate(booking.startAt);
  const end = compactCalendarDate(booking.endAt);
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "Call com a Aive",
    dates: `${start}/${end}`,
    details: "Call estrategica com a Aive. O link da reuniao sera enviado antes do horario.",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function renderTemplate(template: string, values: Record<string, string>) {
  return Object.entries(values).reduce(
    (rendered, [key, value]) => rendered.replaceAll(`{{${key}}}`, escapeHtml(value)),
    template,
  );
}

async function renderCustomerEmail(booking: Booking) {
  const template = await loadBookingConfirmationTemplate();
  const data = dateFormatter.format(new Date(booking.startAt));
  const horario = timeFormatter.format(new Date(booking.startAt));
  const duracao = `${schedulingConfig.slotDurationMinutes} minutos`;
  const calendarLink = createCalendarLink(booking);
  const html = renderTemplate(template, {
    nome: booking.name,
    data,
    horario,
    duracao,
    calendar_link: calendarLink,
  });
  const text = [
    `Ola, ${booking.name}.`,
    "",
    "Sua call com a Aive esta confirmada.",
    `Data: ${data}`,
    `Horario: ${horario} (${schedulingConfig.timezone})`,
    `Duracao: ${duracao}`,
    `Adicionar ao calendario: ${calendarLink}`,
    "",
    "Ate breve!",
  ].join("\n");

  return { html, text };
}

async function renderOwnerEmail(booking: Booking) {
  const template = await loadOwnerNotificationTemplate();
  const data = dateFormatter.format(new Date(booking.startAt));
  const horario = timeFormatter.format(new Date(booking.startAt));
  const duracao = `${schedulingConfig.slotDurationMinutes} minutos`;
  const calendarLink = createCalendarLink(booking);
  const html = renderTemplate(template, {
    nome: booking.name,
    email: booking.email,
    data,
    horario,
    duracao,
    calendar_link: calendarLink,
  });
  const text = [
    "Nova call marcada no site da Aive.",
    "",
    `Cliente: ${booking.name}`,
    `E-mail: ${booking.email}`,
    `Data: ${data}`,
    `Horario: ${horario} (${schedulingConfig.timezone})`,
    `Duracao: ${duracao}`,
    `Adicionar ao calendario: ${calendarLink}`,
  ].join("\n");

  return { html, text };
}

export async function sendBookingEmails(booking: Booking): Promise<"sent" | "skipped" | "failed"> {
  if (!process.env.RESEND_API_KEY) {
    console.info("RESEND_API_KEY ausente; envio de e-mail de agendamento pulado.");
    return "skipped";
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  const formattedDate = internalDateTimeFormatter.format(new Date(booking.startAt));
  const topic = booking.topic ? `\nAssunto: ${booking.topic}` : "";
  const customerEmail = await renderCustomerEmail(booking);
  const ownerEmail = await renderOwnerEmail(booking);

  try {
    console.info("Configuracao de envio de agendamento:", {
      from: schedulingConfig.fromEmail,
      ownerEmail: schedulingConfig.ownerEmail,
      customerEmail: booking.email,
    });
    const [customerResult, ownerResult] = await Promise.all([
      resend.emails.send({
        from: schedulingConfig.fromEmail,
        to: booking.email,
        replyTo: replyToEmails,
        subject: "Sua call com a Aive está confirmada",
        html: customerEmail.html,
        text: customerEmail.text,
      }),
      resend.emails.send({
        from: schedulingConfig.fromEmail,
        to: schedulingConfig.ownerEmail,
        subject: "Nova call marcada no site da Aive",
        html: ownerEmail.html,
        text: `${ownerEmail.text}${topic}\nData completa: ${formattedDate}\nSlot ISO: ${booking.startAt}`,
      }),
    ]);
    console.info("Retorno bruto do Resend para confirmacao do cliente:", {
      data: customerResult.data,
      error: customerResult.error,
    });
    console.info("Retorno bruto do Resend para aviso interno:", {
      data: ownerResult.data,
      error: ownerResult.error,
    });
    if (resendResultHasError(customerResult) || resendResultHasError(ownerResult)) {
      console.error("Resend rejeitou um ou mais e-mails de agendamento:", {
        customer: customerResult.error,
        owner: ownerResult.error,
      });
      return "failed";
    }
    return "sent";
  } catch (error) {
    console.error("Falha ao enviar e-mails via Resend:", error);
    return "failed";
  }
}
