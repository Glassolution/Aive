import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import heroPhone from "@/assets/hero-phone.png";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  ChevronDown,
  CheckCircle2,
  Globe2,
  LayoutPanelTop,
  Layers3,
  MessageSquareMore,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aive — Calls qualificadas nos EUA com design premium" },
      {
        name: "description",
        content:
          "Aive gera chamadas qualificadas para fundadores brasileiros nos EUA com um modelo pago por resultado, sem mídia por sua conta e com operação completa.",
      },
      { property: "og:title", content: "Aive — Crescimento pago por chamada para brasileiros nos EUA" },
      {
        property: "og:description",
        content:
          "Landing premium da Aive para geração de chamadas qualificadas com visual editorial e foco em conversão.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-white text-foreground">
      <Nav />
      <Hero />
      <TrustStrip />
      <Benefits />
      <HowItWorks />
      <Pricing />
      <Results />
      <FAQ />
      <CTA />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-[1320px] px-5 pb-0 pt-12 sm:px-6 lg:px-0 lg:pt-20">
      <div className="grid items-start gap-8 lg:grid-cols-[0.55fr_0.45fr] lg:gap-0">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-8 max-w-[820px]"
        >
          <p className="text-[11px] leading-6 text-muted-foreground">
            Para fundadores brasileiros com LLCs e Inc.s nos EUA
          </p>

          <h1 className="mt-2 max-w-[12.8ch] text-[clamp(2.75rem,9vw,5.45rem)] font-medium leading-[1.04] tracking-[-0.02em] text-foreground sm:max-w-[13.8ch] lg:max-w-[720px] lg:text-[clamp(4rem,4.25vw,5rem)]">
            Mais chamadas qualificadas na sua mão.
          </h1>

          <p className="mt-4 max-w-[540px] text-[15px] leading-8 text-muted-foreground">
            A Aive roda uma operação bonita e eficiente de aquisição para os EUA. Você só paga
            quando a chamada qualificada entra no calendário.
          </p>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-14 rounded-full bg-[#111722] px-8 text-[14px] font-semibold text-white shadow-none hover:bg-[#1a2230]"
            >
              <Link to="/book-a-call">Agendar sessão estratégica</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 rounded-full border-transparent bg-[#ebe8e5] px-8 text-[14px] font-semibold text-foreground shadow-none hover:bg-[#e2ddda]"
            >
              <a href="#benefits">Explorar benefícios</a>
            </Button>
          </div>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.1 }}
      className="relative ml-auto -mr-12 -mt-28 hidden h-[730px] w-full max-w-[760px] items-start justify-end overflow-hidden pt-0 lg:flex 2xl:-mr-20"
    >
      <div className="absolute right-[10%] top-[24%] h-[470px] w-[470px] rounded-full bg-[#f27949]" />
      <img
        src={heroPhone}
        alt="Preview da experiência mobile da Aive"
        className="relative z-10 h-auto w-full max-w-[620px] translate-x-20 drop-shadow-none 2xl:max-w-[650px]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-gradient-to-t from-white to-transparent" />
      <div className="pointer-events-none absolute -bottom-5 left-[5%] z-20 h-40 w-[44%] bg-[radial-gradient(ellipse_at_bottom_left,white_0%,white_40%,rgba(255,255,255,0.7)_58%,transparent_78%)]" />
    </motion.div>
  );
}

function FloatingSidebar() {
  const items = [
    {
      label: "Agendar diagnóstico",
      icon: <ArrowUpRight className="h-3.5 w-3.5" />,
      className:
        "border border-black/8 bg-[#f2f0ee] text-foreground hover:bg-[#e9e5e1]",
    },
    {
      label: "Ver plano da AIVE",
      icon: <LayoutPanelTop className="h-3.5 w-3.5" />,
      className: "bg-[#4c52ff] text-white hover:bg-[#4349ea]",
    },
    {
      label: "Modelo pago por chamada",
      icon: <Layers3 className="h-3.5 w-3.5" />,
      className: "bg-[#111827] text-white hover:bg-[#0b1020]",
    },
    {
      label: "Feito para founders BR",
      icon: <BadgeCheck className="h-3.5 w-3.5" />,
      className:
        "border border-black/8 bg-[#f2f0ee] text-foreground hover:bg-[#e9e5e1]",
    },
  ];
  return (
    <div className="fixed bottom-6 right-5 z-50 hidden flex-col gap-2 xl:flex">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={`inline-flex h-[44px] min-w-[296px] items-center justify-center gap-2 rounded-[10px] px-5 text-[12px] font-medium shadow-[0_10px_28px_rgba(15,23,42,0.1)] transition ${item.className}`}
        >
          {item.icon}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

function TrustStrip() {
  const items = [
    { name: "CertaPro Painters", logo: "https://www.google.com/s2/favicons?domain=certapro.com&sz=128", color: "#324B9B" },
    { name: "Five Star Painting", logo: "https://www.google.com/s2/favicons?domain=fivestarpainting.com&sz=128", color: "#E6502E" },
    { name: "WOW 1 DAY Painting", logo: "https://www.google.com/s2/favicons?domain=wow1day.com&sz=128", color: "#22A7E0" },
    { name: "360 Painting", logo: "https://www.google.com/s2/favicons?domain=360painting.com&sz=128", color: "#F26A21" },
    { name: "Fresh Coat Painters", logo: "https://www.google.com/s2/favicons?domain=freshcoatpainters.com&sz=128", color: "#1081C4" },
    { name: "Color World Painting", logo: "https://www.google.com/s2/favicons?domain=colorworldpainting.com&sz=128", color: "#35A852" },
    { name: "College Works Painting", logo: "https://www.google.com/s2/favicons?domain=collegeworks.com&sz=128", color: "#D83A2E" },
    { name: "That 1 Painter", logo: "https://www.google.com/s2/favicons?domain=that1painter.com&sz=128", color: "#7F8B99" },
  ];

  return (
    <section className="relative mt-16 overflow-hidden bg-transparent pb-3">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-white via-white/95 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-white via-white/95 to-transparent" />
      <div className="marquee-track flex w-max items-center gap-20">
        {[...items, ...items, ...items].map((i, index) => (
          <span key={`${i.name}-${index}`} className="inline-flex h-14 w-64 shrink-0 items-center justify-center gap-3">
            <img
              src={i.logo}
              alt={i.name}
              className="h-8 w-8 rounded-md object-contain drop-shadow-[0_4px_10px_rgba(15,23,42,0.12)]"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
            <span className="text-[1.3rem] font-bold leading-none tracking-[-0.04em] text-[#111722]">
              {i.name}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

function LogoMark({ type, color }: { type: string; color: string }) {
  if (type === "stars") {
    return <span className="text-[1.15rem] font-black leading-none" style={{ color }}>★</span>;
  }
  if (type === "bolt") {
    return <span className="text-[1.7rem] font-black leading-none" style={{ color }}>✦</span>;
  }
  if (type === "circle") {
    return <span className="h-6 w-6 rounded-full border-[6px]" style={{ borderColor: color }} />;
  }
  if (type === "fan") {
    return <span className="h-7 w-7 rounded-full border-t-[10px] border-r-[10px] border-l-[10px] border-transparent" style={{ borderTopColor: color }} />;
  }
  if (type === "bars") {
    return (
      <span className="flex h-7 items-center gap-1">
        {[12, 20, 26, 18].map((height) => (
          <span key={height} className="w-1.5 rounded-full" style={{ height, backgroundColor: color }} />
        ))}
      </span>
    );
  }
  if (type === "square") {
    return <span className="grid h-7 w-7 place-items-center bg-black"><span className="h-3 w-3 rounded-full bg-white" /></span>;
  }
  if (type === "slash") {
    return <span className="h-7 w-2 rotate-45 rounded-full" style={{ backgroundColor: color }} />;
  }
  return <span className="h-6 w-6 rounded-full border-2" style={{ borderColor: color }} />;
}

function Benefits() {
  const [activeBenefit, setActiveBenefit] = useState(0);
  const items = [
    {
      icon: <Target className="h-4 w-4" />,
      title: "Oferta e posicionamento para o mercado americano",
      body: "Ajustamos mensagem, promessa e criativos para atrair o lead certo sem desperdiçar orçamento com tentativa e erro.",
    },
    {
      icon: <MessageSquareMore className="h-4 w-4" />,
      title: "Agendamento qualificado com fluxo pronto para conversão",
      body: "Landing, filtros e follow-up trabalham juntos para transformar cliques em conversas reais no seu calendário.",
    },
    {
      icon: <ShieldCheck className="h-4 w-4" />,
      title: "Modelo alinhado ao resultado, não à retenção",
      body: "Sem contrato pesado e sem mídia por sua conta. A Aive ganha quando a chamada qualificada realmente aparece.",
    },
  ];
  const benefitVisuals = [
    {
      label: "Oferta calibrada",
      title: "Perfil de cliente ideal",
      prompt: "Founder BR com LLC nos EUA",
      rows: [
        ["Promessa", "Mais calls qualificadas, sem mídia por sua conta"],
        ["Segmento", "Consultorias, agências e serviços B2B"],
        ["Criativos", "Ângulos em vídeo + estáticos para teste"],
      ],
      footer: "Mensagem pronta para atrair o lead certo.",
    },
    {
      label: "Fluxo de conversão",
      title: "Agenda qualificada",
      prompt: "Filtro + landing + follow-up",
      rows: [
        ["Lead", "Responde critérios antes de marcar"],
        ["Calendário", "Horários disponíveis conectados"],
        ["Follow-up", "Lembretes automáticos até a call"],
      ],
      footer: "Clique vira conversa real no calendário.",
    },
    {
      label: "Modelo por resultado",
      title: "Cobrança alinhada",
      prompt: "Você paga só por chamada válida",
      rows: [
        ["Mídia", "Investimento em anúncios por conta da Aive"],
        ["Risco", "Sem mensalidade fixa ou setup pesado"],
        ["Validação", "Critérios de call definidos antes do início"],
      ],
      footer: "Aive ganha quando a chamada aparece.",
    },
  ];
  const visual = benefitVisuals[activeBenefit];

  return (
    <section id="benefits" className="mx-auto max-w-[1320px] px-5 py-24 sm:px-6 lg:px-0 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] uppercase tracking-[0.36em] text-[#ff5d0a]">Benefícios</p>
        <h2 className="mt-6 text-[clamp(2.5rem,4.4vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.055em] text-foreground">
          A vantagem da Aive
        </h2>
        <p className="hidden">
          Uma operacao enxuta para transformar atencao em conversas comerciais reais.
        </p>
      </div>

      <div className="mt-20 grid gap-12 xl:grid-cols-[0.42fr_0.58fr] xl:items-stretch">
        <div className="mx-auto w-full max-w-[430px] space-y-8 xl:mx-0">
          {items.map((item, index) => (
            <BenefitItem
              key={item.title}
              active={index === activeBenefit}
              onClick={() => setActiveBenefit(index)}
              {...item}
            />
          ))}
        </div>

        <div className="relative overflow-hidden rounded-[24px] bg-[#fbfaf8] px-6 py-10 md:min-h-[620px] md:px-12 md:py-14">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute left-[52%] top-[48%] h-64 w-[520px] -translate-x-1/2 -translate-y-1/2 rotate-[-28deg] rounded-full border-[18px] border-white/55" />
            <div className="absolute left-[58%] top-[45%] h-52 w-[420px] -translate-x-1/2 -translate-y-1/2 rotate-[-28deg] rounded-full border-[14px] border-white/40" />
          </div>

          <div className="relative mx-auto flex max-w-[400px] flex-col gap-5 pt-16">
            <div className="w-fit rounded-[18px] bg-white px-5 py-4 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.28)]">
              <p className="text-sm font-semibold text-foreground">
                {visual.label}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                {[
                  "https://i.pravatar.cc/64?img=12",
                  "https://i.pravatar.cc/64?img=32",
                  "https://i.pravatar.cc/64?img=48",
                ].map((src) => (
                  <img key={src} src={src} alt="" className="-mr-2 h-8 w-8 rounded-full border-2 border-white object-cover" />
                ))}
                <span className="ml-2">Compartilhado com 3 founders</span>
              </div>
            </div>

            <div className="rounded-[20px] bg-white p-5 shadow-[0_12px_32px_-24px_rgba(0,0,0,0.28)]">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#ff5d0a]">Aive</p>
                  <h3 className="mt-1 text-lg font-semibold tracking-[-0.04em] text-foreground">
                    {visual.title}
                  </h3>
                </div>
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#111722] text-xs font-semibold text-white">
                  {activeBenefit + 1}
                </span>
              </div>
              <div className="rounded-[13px] border border-[#ff5d0a]/45 bg-[#fff7f2] px-4 py-3 text-sm text-muted-foreground">
                {visual.prompt}
              </div>
              <div className="mt-4 space-y-3.5">
                {visual.rows.map(([name, niche], index) => (
                  <div key={name} className="flex items-center gap-3 rounded-[14px] border border-border/70 bg-white px-3 py-3">
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fff1e9] text-sm font-semibold text-[#ff5d0a]">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-foreground">{name}</p>
                      <p className="text-xs text-muted-foreground">
                        {niche}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 rounded-full bg-[#111722] px-5 py-3 text-center text-sm font-semibold text-white">
                {visual.footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BenefitItem({
  active,
  icon,
  title,
  body,
  onClick,
}: {
  active?: boolean;
  icon: React.ReactNode;
  title: string;
  body: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative rounded-[18px] px-6 py-7 transition ${
        active
          ? "bg-[#fbfaf8]"
          : "bg-transparent"
      } text-left hover:bg-[#fbfaf8]`}
    >
      {active && <div className="absolute left-0 top-0 h-full w-[3px] rounded-full bg-[#ff5d0a]" />}
      <div className="flex items-start gap-5">
        <span className="mt-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#ff5d0a] text-white">
          {icon}
        </span>
        <div>
          <h3 className="text-[1.12rem] font-semibold tracking-[-0.035em] text-foreground">{title}</h3>
          <p className="mt-6 max-w-[340px] text-[15px] leading-8 text-muted-foreground">{body}</p>
        </div>
      </div>
    </button>
  );
}

function HowItWorks() {
  return (
    <section id="how" className="mx-auto max-w-[1320px] px-5 py-24 sm:px-6 lg:px-0 md:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] uppercase tracking-[0.36em] text-[#ff5d0a]">Recursos</p>
        <h2 className="mt-6 text-[clamp(2.5rem,4.4vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.055em]">
          Sistema completo para gerar chamadas qualificadas.
        </h2>
      </div>

      <div className="mt-20 grid gap-8 lg:grid-cols-[0.92fr_2.08fr]">
        <FeatureCard className="min-h-[520px] items-center justify-between text-center">
          <div className="mx-auto mt-8 w-full max-w-[280px] rounded-[22px] bg-white p-5 shadow-[0_30px_80px_-55px_rgba(0,0,0,0.45)]">
            <div className="mb-5 flex items-center justify-between text-sm font-semibold">
              <span>Briefing</span>
              <span className="text-xl leading-none">x</span>
            </div>
            <div className="space-y-3 text-left text-xs text-muted-foreground">
              <div className="rounded-lg border border-border bg-[#faf9f8] px-4 py-3">Oferta principal</div>
              <div className="h-20 rounded-lg border border-border bg-[#faf9f8] px-4 py-3">Mensagem do lead</div>
            </div>
            <div className="mt-4 rounded-full bg-foreground px-5 py-3 text-sm font-medium text-white">Compartilhar funil</div>
          </div>
          <p className="mx-auto max-w-[300px] pb-4 text-[1.25rem] font-medium leading-8 tracking-[-0.04em]">
            Tudo que o lead precisa ver antes de marcar uma chamada.
          </p>
        </FeatureCard>

        <FeatureCard className="min-h-[520px] justify-between overflow-hidden">
          <div className="pointer-events-none absolute inset-x-20 top-8 h-[350px] bg-[linear-gradient(90deg,transparent,rgba(15,23,42,0.08),transparent)] opacity-70" />
          <div className="relative mx-auto mt-9 grid w-full max-w-[760px] gap-5 md:grid-cols-2">
            <PipelineCard title="Campanha EUA" tag="Lead quente" avatars="LR" />
            <PipelineCard title="Follow-up qualificado" tag="Apareceu" avatars="MP" />
            <div className="md:col-span-2 md:mx-auto md:w-[55%]">
              <PipelineCard title="Chamada no calendario" tag="Alta prioridade" avatars="RM" />
            </div>
          </div>
          <p className="relative mx-auto max-w-[720px] pb-5 text-center text-[1.2rem] font-medium leading-8 tracking-[-0.035em]">
            Aquisicao, qualificacao e agenda conectadas em uma experiencia clara.
          </p>
        </FeatureCard>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[2.08fr_0.92fr]">
        <FeatureCard className="min-h-[420px] justify-between overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white/85 to-transparent" />
          <div className="relative mx-auto mt-12 w-full max-w-[560px] rounded-[20px] bg-white shadow-[0_32px_90px_-60px_rgba(0,0,0,0.55)]">
            {["Criar oferta", "Separar leads qualificados", "Enviar para agenda"].map((label, index) => (
              <div key={label} className={`flex items-center justify-between px-6 py-4 text-sm ${index === 1 ? "border-l-2 border-primary bg-[#f7f3f1]" : ""}`}>
                <span>{label}</span>
                <span className="rounded-lg bg-[#f2f0ef] px-3 py-1 text-xs text-muted-foreground">{["C", "L", "A"][index]}</span>
              </div>
            ))}
          </div>
          <p className="relative mx-auto max-w-[720px] pb-4 text-center text-[1.2rem] font-medium leading-8 tracking-[-0.035em]">
            Processos simples para organizar a operacao sem parecer uma planilha.
          </p>
        </FeatureCard>

        <FeatureCard className="min-h-[420px] items-center justify-between text-center">
          <div className="mt-10 w-full max-w-[270px] rounded-[22px] bg-white p-5 shadow-[0_32px_90px_-60px_rgba(0,0,0,0.55)]">
            <p className="mb-4 text-left text-sm font-semibold">Hoje</p>
            {["Revisar leads", "Confirmar agenda"].map((label, index) => (
              <div key={label} className="flex items-center gap-3 border-t border-border py-3 text-left text-sm text-muted-foreground">
                <span className={`h-3 w-3 rounded-full ${index === 0 ? "bg-primary" : "bg-muted-foreground/35"}`} />
                {label}
              </div>
            ))}
          </div>
          <p className="mx-auto max-w-[300px] pb-4 text-[1.25rem] font-medium leading-8 tracking-[-0.04em]">
            Visao diaria das acoes que movem o funil.
          </p>
        </FeatureCard>
      </div>
    </section>
  );
}

function FeatureCard({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={`relative flex flex-col rounded-[24px] bg-[#f6f4f2] p-8 ${className}`}>
      {children}
    </div>
  );
}

function PipelineCard({ title, tag, avatars }: { title: string; tag: string; avatars: string }) {
  return (
    <div className="rounded-[18px] bg-white p-5 shadow-[0_28px_70px_-52px_rgba(0,0,0,0.5)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-[1.05rem] font-semibold tracking-[-0.035em]">{title}</h3>
          <p className="mt-3 text-sm text-muted-foreground">Semana atual</p>
        </div>
        <span className="text-lg leading-none">...</span>
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="rounded-xl bg-[#f3eeee] px-3 py-2 text-xs text-muted-foreground">{tag}</span>
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#d8ebe8] text-xs font-semibold text-foreground">{avatars}</span>
      </div>
    </div>
  );
}
function Pricing() {
  const items = [
    "Estratégia de oferta + perfil de cliente ideal",
    "Criativos em vídeo e estáticos ilimitados",
    "Landing page de alta conversão",
    "Pixel, rastreamento e configuração do CRM",
    "Gestão completa de Meta Ads e Google",
    "Investimento em anúncios por nossa conta",
    "Otimização semanal + relatórios",
    "Cobrança apenas por chamadas qualificadas agendadas",
  ];

  return (
    <section id="pricing" className="mx-auto max-w-[1320px] px-5 py-20 sm:px-6 lg:px-0 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-[11px] uppercase tracking-[0.36em] text-[#ff5d0a]">Preço</p>
        <h2 className="mt-6 text-[clamp(2.5rem,4.4vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.055em]">
          Um preço. Zero surpresas.
        </h2>
      </div>

      <div className="mt-14 rounded-[20px] border border-[#d9dee8] bg-white px-6 py-9 shadow-[0_16px_44px_rgba(15,23,42,0.04)] sm:px-10 lg:grid lg:grid-cols-[0.82fr_1fr] lg:gap-16 lg:px-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[#fff1e9] px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.02em] text-[#ff5d0a]">
            <Sparkles className="h-3.5 w-3.5" />
            Pague por chamada
          </span>
          <div className="mt-7 flex flex-wrap items-end gap-x-3 gap-y-1">
            <span className="text-[clamp(3rem,5vw,4.1rem)] font-medium leading-none tracking-[-0.055em] text-foreground">
              $127
            </span>
            <span className="pb-2 text-[17px] text-muted-foreground">/ chamada agendada</span>
          </div>

          <p className="mt-7 max-w-[500px] text-[17px] leading-8 text-muted-foreground">
            Sem mensalidade. Sem custo de configuração. Sem investimento em anúncios por sua conta.
            Se a chamada não cair no seu calendário, você não paga.
          </p>

          <Button
            asChild
            size="lg"
            className="mt-8 h-14 rounded-full bg-[#111722] px-8 text-[15px] font-semibold text-white shadow-none hover:bg-[#1a2230]"
          >
            <Link to="/book-a-call">Agendar sessão</Link>
          </Button>
        </div>

        <ul className="mt-10 space-y-5 lg:mt-0">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-4 text-[15px] leading-6 text-foreground">
              <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center text-[#ff5d0a]">
                <CheckCircle2 className="h-4 w-4" />
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
function Results() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const cases = [
    {
      name: "Lucas Rocha",
      role: "Consultoria B2B",
      quote: "A Aive transformou uma oferta parada em chamadas reais com founders nos EUA. O funil ficou claro e facil de acompanhar.",
      rating: "4.8/5 avaliacao",
      photo: "https://i.pravatar.cc/120?img=12",
    },
    {
      name: "Marina Prado",
      role: "Servicos profissionais",
      quote: "Eu queria previsibilidade sem contratar uma estrutura inteira. As chamadas qualificadas comecaram a entrar e o processo ficou leve.",
      rating: "4.9/5 avaliacao",
      photo: "https://i.pravatar.cc/120?img=32",
    },
    {
      name: "Rafael Melo",
      role: "Agencia nos EUA",
      quote: "O melhor ponto e o alinhamento: se nao tem chamada qualificada, nao tem cobranca. Isso muda completamente a relacao.",
      rating: "5/5 avaliacao",
      photo: "https://i.pravatar.cc/120?img=59",
    },
    {
      name: "Bianca Torres",
      role: "Mentoria para founders",
      quote: "O processo ficou muito mais profissional. A pagina, a oferta e o filtro dos leads deixaram as conversas muito melhores.",
      rating: "4.8/5 avaliacao",
      photo: "https://i.pravatar.cc/120?img=44",
    },
    {
      name: "Daniel Costa",
      role: "Servicos B2B",
      quote: "Antes eu dependia de indicacao. Com a Aive, comecei a ter uma rotina previsivel de chamadas boas no calendario.",
      rating: "4.9/5 avaliacao",
      photo: "https://i.pravatar.cc/120?img=15",
    },
  ];
  const maxTestimonialIndex = Math.max(cases.length - 2, 0);
  const testimonialStages = Array.from({ length: maxTestimonialIndex + 1 });
  const nextTestimonial = () =>
    setTestimonialIndex((index) => (index >= maxTestimonialIndex ? 0 : index + 1));
  const prevTestimonial = () =>
    setTestimonialIndex((index) => (index <= 0 ? maxTestimonialIndex : index - 1));

  return (
    <section id="results" className="mx-auto max-w-[1440px] px-5 py-24 sm:px-6 md:py-32">
      <div className="overflow-hidden rounded-[30px] bg-[#fbfaf8] px-8 py-28 md:px-16">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[11px] uppercase tracking-[0.36em] text-[#ff5d0a]">Testemunhos</p>
          <h2 className="mt-7 text-[clamp(2.5rem,4.4vw,4.6rem)] font-medium leading-[1.02] tracking-[-0.055em]">
            O que nossos clientes estao dizendo
          </h2>
        </div>

        <div className="mt-20 overflow-hidden">
          <div
            className="flex gap-6 transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${testimonialIndex * 50}%)` }}
          >
            {cases.map((c) => (
              <div key={c.name} className="grid min-w-full grid-cols-[150px_1fr] gap-8 rounded-[18px] border border-border bg-white p-8 md:min-w-[calc((100%-24px)/2)]">
                <div className="flex flex-col justify-between">
                  <div>
                    <img src={c.photo} alt="" className="h-16 w-16 rounded-full object-cover" />
                    <h3 className="mt-7 font-semibold">{c.name}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{c.role}</p>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-lg font-semibold text-primary">G</span>
                    {c.rating}
                  </div>
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-[1.2rem] leading-9 tracking-[-0.035em] text-foreground">{c.quote}</p>
                  <div className="flex justify-end gap-1 text-primary">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star key={index} className="h-5 w-5 fill-primary" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid grid-cols-[1fr_auto] items-center gap-8">
          <div className="flex h-1 w-full overflow-hidden rounded-full bg-foreground/10">
            {testimonialStages.map((_, index) => (
              <div
                key={index}
                className={`h-full flex-1 transition-colors duration-300 ${
                  index === testimonialIndex ? "bg-foreground" : "bg-transparent"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-4">
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-white disabled:opacity-35"
              type="button"
              onClick={prevTestimonial}
            >
              <ArrowRight className="h-5 w-5 rotate-180" />
            </button>
            <button
              className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-foreground text-white disabled:opacity-35"
              type="button"
              onClick={nextTestimonial}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}function FAQ() {
  const items = [
    {
      q: "Como a Aive cobra por chamada qualificada?",
      a: "Voce so paga quando um lead qualificado entra no seu calendario. Antes do lancamento, combinamos os criterios do que conta como chamada valida.",
    },
    {
      q: "Eu preciso pagar o investimento em anuncios?",
      a: "Nao. A Aive cobre a midia e assume o risco da aquisicao. O modelo foi pensado para alinhar incentivo com resultado.",
    },
    {
      q: "Em quanto tempo a operacao entra no ar?",
      a: "Normalmente lancamos em menos de 7 dias depois do diagnostico inicial, com oferta, pagina, criativos e rastreamento preparados.",
    },
    {
      q: "Funciona para qualquer nicho?",
      a: "O foco e em founders brasileiros com LLCs e Inc.s nos EUA, especialmente consultorias, agencias, coaches e servicos B2B.",
    },
  ];
  return (
    <section id="faq" className="mx-auto grid max-w-[1320px] gap-16 px-5 py-24 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-0 md:py-32">
      <div>
        <p className="text-[11px] uppercase tracking-[0.36em] text-[#ff5d0a]">Perguntas frequentes</p>
        <h2 className="mt-8 max-w-[640px] text-[clamp(2.5rem,4.4vw,4.6rem)] font-medium leading-[1.08] tracking-[-0.055em]">
          Tem perguntas? Temos respostas
        </h2>
        <p className="mt-8 max-w-[430px] text-[15px] leading-8 text-muted-foreground">
          Tudo que voce precisa saber antes de agendar uma sessao estrategica com a Aive.
        </p>
      </div>
      <div className="space-y-5">
        {items.map((it, i) => (
          <FAQItem key={it.q} {...it} defaultOpen={i === 0} />
        ))}
      </div>
    </section>
  );
}

function FAQItem({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={`flex w-full items-center justify-between gap-4 rounded-[16px] px-5 py-5 text-left transition ${
          open ? "bg-foreground text-background" : "bg-[#f6f4f2] text-foreground hover:bg-[#eeebe8]"
        }`}
      >
        <span className="font-semibold">{q}</span>
        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${open ? "bg-white text-foreground" : "bg-foreground text-white"}`}>
          <ChevronDown className={`h-5 w-5 transition ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      {open && <div className="px-5 pb-6 pt-7 text-[15px] leading-8 text-muted-foreground">{a}</div>}
    </div>
  );
}
function CTA() {
  return (
    <section id="book" className="mx-auto max-w-5xl px-5 py-16 sm:px-6 md:py-24">
      <div className="relative overflow-hidden rounded-[34px] border border-border/80 bg-[#fbfaf8] p-8 text-center shadow-[0_22px_70px_-45px_rgba(0,0,0,0.2)] md:p-11">
        <div className="mx-auto max-w-2xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
            Próximo passo
          </p>
          <h2 className="mt-4 text-4xl font-medium leading-[1.02] tracking-[-0.04em] md:text-5xl">
            Pronto para preencher seu calendário
            <br />
            <span className="italic">com chamadas qualificadas?</span>
          </h2>
          <p className="mt-5 text-base leading-8 text-muted-foreground">
            Agende uma sessão estratégica gratuita. Se fizer sentido, lançamos seus anúncios em
            menos de 7 dias — e você não paga um dólar até as chamadas caírem no seu calendário.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-14 rounded-full bg-[#111722] px-8 text-sm font-semibold text-white shadow-none hover:bg-[#1a2230]"
          >
            <Link to="/book-a-call">
              Agendar sessão estratégica <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Sem investimento em anúncios por sua conta
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Sem mensalidade fixa
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Lançamento em &lt; 7 dias
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}






