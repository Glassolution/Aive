import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect } from "react";
import { CheckCircle2 } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { notifyBooking } from "@/lib/calendly.functions";

const CALENDLY_URL = "https://calendly.com/xavierluisfelipe17/strategy-call";

export const Route = createFileRoute("/book-a-call")({
  component: BookACallPage,
  head: () => ({
    meta: [
      { title: "Agende sua Sessão de Estratégia - Aive" },
      {
        name: "description",
        content:
          "Agende uma sessão gratuita de 45 minutos para mapear como conquistar 6-8 clientes de telhados por mês sem pagar investimento em anúncios.",
      },
    ],
  }),
});

function BookACallPage() {
  const notify = useServerFn(notifyBooking);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  useEffect(() => {
    function handleCalendlyMessage(event: MessageEvent) {
      if (event.origin !== "https://calendly.com") {
        return;
      }

      const data = event.data as
        | { event?: string; payload?: { event?: { uri?: string }; invitee?: { uri?: string } } }
        | undefined;

      if (data?.event !== "calendly.event_scheduled") {
        return;
      }

      const eventUri = data.payload?.event?.uri;
      const inviteeUri = data.payload?.invitee?.uri;

      if (!eventUri || !inviteeUri) {
        window.location.assign("/pre-call");
        return;
      }

      notify({ data: { eventUri, inviteeUri } })
        .catch((error) => {
          console.error("Falha ao encaminhar agendamento para o Zapier:", error);
        })
        .finally(() => {
          window.location.assign("/pre-call");
        });
    }

    window.addEventListener("message", handleCalendlyMessage);
    return () => window.removeEventListener("message", handleCalendlyMessage);
  }, [notify]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />

      <section className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-6 md:pb-20 md:pt-14">
        <div className="grid items-start gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-12">
          <div className="pt-3 lg:sticky lg:top-28 lg:pt-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              PASSO 1 DE 2
            </p>
            <h1 className="mt-4 max-w-md text-3xl font-medium leading-tight tracking-tight sm:text-[2.35rem]">
              Agende sua sessão de estratégia gratuita.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Uma chamada de 45 minutos onde vamos mapear exatamente como conseguir 6-8 clientes de
              telhados por mês — sem pagar investimento em anúncios.
            </p>
            <ul className="mt-8 space-y-4 text-sm text-foreground sm:text-base">
              {[
                "45 minutos, sem enrolação",
                "Google Meet, com compartilhamento de tela",
                "Sem pressão, sem venda agressiva",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-visible rounded-2xl bg-white">
            <div className="rounded-2xl">
              <div
                className="calendly-inline-widget"
                data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=ffffff&text_color=1a1a1a&primary_color=000000`}
                style={{ minWidth: "320px", height: "1200px" }}
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
