import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { Resend } from "resend";

function loadDevVars() {
  const devVarsPath = fileURLToPath(new URL("../.dev.vars", import.meta.url));
  if (!existsSync(devVarsPath)) return;

  for (const line of readFileSync(devVarsPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadDevVars();

const from = process.env.RESEND_FROM_EMAIL ?? "Aive <agenda@aive.com>";
const to = process.argv[2] ?? "lucassrby@gmail.com";

if (!process.env.RESEND_API_KEY) {
  console.error("RESEND_API_KEY ausente.");
  process.exit(1);
}

const resend = new Resend(process.env.RESEND_API_KEY);

const result = await resend.emails.send({
  from,
  to,
  subject: "Teste direto Resend - Aive",
  text: "Este e um teste direto do Resend, fora do fluxo de agendamento.",
  html: "<p>Este e um teste direto do Resend, fora do fluxo de agendamento.</p>",
});

console.log(
  JSON.stringify(
    {
      from,
      to,
      data: result.data,
      error: result.error,
    },
    null,
    2,
  ),
);
