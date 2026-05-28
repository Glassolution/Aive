import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const VIDEO_EMBED_URL = "https://www.youtube.com/embed/dQw4w9WgXcQ";

export const Route = createFileRoute("/pre-call")({
  component: PreCallPage,
  head: () => ({
    meta: [
      { title: "Assista Antes da Call - Aive" },
      {
        name: "description",
        content:
          "Assista ao vídeo antes da sua call com a Aive para entender o processo e chegar preparado.",
      },
    ],
  }),
});

function PreCallPage() {
  const prepCards = [
    {
      title: "Assista o video completo",
      description:
        "São apenas alguns minutos. Fizemos isso para não desperdiçar seu tempo na call.",
    },
    {
      title: "Tenha seus números em mãos",
      description: "Área de atendimento, tamanho médio dos jobs e quantidade de clientes por mês.",
    },
    {
      title: "Entre 2 minutos antes",
      description: "Teste seu áudio e vídeo. O link do Google Meet está no seu e-mail.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />

      <main className="mx-auto max-w-6xl px-5 pb-16 pt-10 sm:px-6 md:pb-20 md:pt-14">
        <section className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-foreground shadow-sm">
            ✓ Você está agendado — verifique seu e-mail para a confirmação
          </div>

          <h1 className="mt-6 text-3xl font-medium leading-tight tracking-tight sm:text-4xl md:text-[2.75rem]">
            Assista a este <span className="text-[#FF6B00]">vídeo</span> antes da nossa call.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Este vídeo explica exatamente como a Aive funciona, o que esperar e as perguntas que
            abordaremos na call — para que possamos pular o básico e mergulhar nos seus números.
          </p>
        </section>

        <section className="mx-auto mt-10 max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm shadow-black/[0.04]">
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={VIDEO_EMBED_URL}
                title="Vídeo pre-call da Aive"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
        </section>

        <section className="mx-auto mt-8 grid max-w-5xl gap-4 md:grid-cols-3">
          {prepCards.map((card, index) => (
            <article
              key={card.title}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm shadow-black/[0.03]"
            >
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
                {index + 1}
              </div>
              <h2 className="mt-4 text-sm font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
            </article>
          ))}
        </section>

        <p className="mt-12 text-center text-sm text-muted-foreground">
          Até breve — animado para construir seu funil.
        </p>
      </main>

      <Footer />
    </div>
  );
}
