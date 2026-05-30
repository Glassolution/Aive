import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";

const VIDALYTICS_EMBED_ID = "vidalytics_embed_HxbVuctOb8mY2vag";
const VIDALYTICS_SCRIPT_ID = "vidalytics-loader-HxbVuctOb8mY2vag";

export const Route = createFileRoute("/pre-call")({
  component: PreCallPage,
  head: () => ({
    meta: [
      { title: "Assista Antes da Chamada - Aive" },
      {
        name: "description",
        content:
          "Assista ao vídeo antes da sua chamada com a Aive para entender o processo e chegar preparado.",
      },
    ],
  }),
});

function VidalyticsEmbed() {
  useEffect(() => {
    const existingScript = document.getElementById(VIDALYTICS_SCRIPT_ID);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement("script");
    script.id = VIDALYTICS_SCRIPT_ID;
    script.type = "text/javascript";
    script.text = `
(function (v, i, d, a, l, y, t, c, s) {
    y='_'+d.toLowerCase();c=d+'L';if(!v[d]){v[d]={};}if(!v[c]){v[c]={};}if(!v[y]){v[y]={};}var vl='Loader',vli=v[y][vl],vsl=v[c][vl + 'Script'],vlf=v[c][vl + 'Loaded'],ve='Embed';
    if (!vsl){vsl=function(u,cb){
        if(t){cb();return;}s=i.createElement("script");s.type="text/javascript";s.async=1;s.src=u;
        if(s.readyState){s.onreadystatechange=function(){if(s.readyState==="loaded"||s.readyState=="complete"){s.onreadystatechange=null;vlf=1;cb();}};}else{s.onload=function(){vlf=1;cb();};}
        i.getElementsByTagName("head")[0].appendChild(s);
    };}
    vsl(l+'loader.min.js',function(){if(!vli){var vlc=v[c][vl];vli=new vlc();}vli.loadScript(l+'player.min.js',function(){var vec=v[d][ve];t=new vec();t.run(a);});});
})(window, document, 'Vidalytics', '${VIDALYTICS_EMBED_ID}', 'https://fast.vidalytics.com/embeds/oidCbfeH/HxbVuctOb8mY2vag/');
`;

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      id={VIDALYTICS_EMBED_ID}
      className="w-full"
      style={{ width: "100%", position: "relative", paddingTop: "56.25%" }}
    />
  );
}

function PreCallPage() {
  const prepCards = [
    {
      title: "Assista o vídeo completo",
      description:
        "São apenas alguns minutos. Fizemos isso para não desperdiçar seu tempo na chamada.",
    },
    {
      title: "Tenha seus números em mãos",
      description:
        "Área de atendimento, tamanho médio dos serviços e quantidade de clientes por mês.",
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
            Assista a este <span className="text-[#FF6B00]">vídeo</span> antes da nossa chamada.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Este vídeo explica exatamente como a Aive funciona, o que esperar e as perguntas que
            abordaremos na chamada — para que possamos pular o básico e mergulhar nos seus números.
          </p>
        </section>

        <section className="mx-auto mt-10 w-full max-w-[900px]">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm shadow-black/[0.04]">
            <VidalyticsEmbed />
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
