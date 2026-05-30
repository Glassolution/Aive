import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

export const Route = createFileRoute("/welcome")({
  component: WelcomePage,
  head: () => ({
    meta: [
      { title: "Bem-vindo à Aive" },
      {
        name: "description",
        content:
          "Pagamento confirmado. Preencha o formulário de integração para iniciarmos sua campanha.",
      },
    ],
  }),
});

function WelcomePage() {
  const [isComplete, setIsComplete] = useState(false);

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-6 md:pb-20 md:pt-14">
        <section className="mx-auto max-w-3xl text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary">
            <Check className="h-5 w-5" />
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            PAGAMENTO RECEBIDO
          </p>

          <h1 className="mt-5 text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-[2.85rem]">
            Pagamento confirmado.
            <br />
            <span className="text-[#FF6B00]">Bem-vindo à Aive.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Um último passo antes de lançarmos seus anúncios. Preencha o formulário abaixo para que
            nossa equipe possa começar a construir sua campanha hoje.
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm shadow-black/[0.04]">
          <div className="border-b border-border px-5 py-5 sm:px-7">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              ETAPA 1 DE 1 · FORMULÁRIO DE INTEGRAÇÃO
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight">
              {isComplete ? "Formulário recebido" : "Conte-nos sobre sua empresa"}
            </h2>
          </div>

          {isComplete ? (
            <div className="p-5 sm:p-7">
              <div className="rounded-2xl border border-primary/15 bg-primary/5 p-6 text-center sm:p-8">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Check className="h-5 w-5" />
                </div>
                <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-foreground">
                  Seu formulário de integração foi recebido! O próximo passo é me chamar no
                  WhatsApp para alinharmos os detalhes.
                </p>
                <a
                  href="https://wa.me/5594991279940"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex h-11 items-center justify-center rounded-lg bg-[#FF6B00] px-8 text-sm font-semibold text-white transition hover:bg-[#e66000]"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          ) : (
            <form
              className="space-y-5 p-5 sm:p-7"
              onSubmit={(event) => {
                event.preventDefault();
                setIsComplete(true);
              }}
            >
              <FormField label="Nome Completo *" name="full-name" placeholder="Seu nome completo" />
              <FormField label="E-mail *" name="email" type="email" placeholder="voce@email.com" />
              <FormField label="WhatsApp *" name="whatsapp" placeholder="+1 (555) 000-0000" />
              <FormField
                label="Site da empresa *"
                name="website"
                type="url"
                placeholder="https://suaempresa.com"
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField label="Estado (nos EUA) *" name="state" placeholder="Ex: Florida" />
                <FormField label="Cidade *" name="city" placeholder="Ex: Orlando" />
              </div>

              <label className="block">
                <span className="text-sm font-medium text-foreground">
                  Qual serviço de telhados você oferece? *
                </span>
                <select
                  name="roofing-service"
                  className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
                  defaultValue=""
                >
                  <option value="" disabled>
                    Selecione uma opção
                  </option>
                  <option value="residencial">Residencial</option>
                  <option value="comercial">Comercial</option>
                  <option value="ambos">Ambos</option>
                </select>
              </label>

              <FormField
                label="Quantos clientes você atende por mês atualmente? *"
                name="monthly-clients"
                placeholder="Ex: 8"
              />
              <FormField
                label="Qual seu valor médio por serviço? *"
                name="average-ticket"
                placeholder="Ex: $8,500"
              />

              <Button
                type="submit"
                className="h-11 w-full rounded-lg bg-[#FF6B00] text-sm font-semibold text-white shadow-none hover:bg-[#e66000] sm:w-auto sm:px-8"
              >
                Próximo →
              </Button>
            </form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function FormField({
  label,
  name,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 h-11 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}
