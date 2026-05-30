import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import roofingHeroPhoto from "@/assets/roofing-crew-hero.jpg";
import { CheckCircle2, CalendarCheck, Rocket, Sparkles, Target, Globe2 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aive — 6–8 chamadas agendadas por mês para fundadores brasileiros nos EUA" },
      {
        name: "description",
        content:
          "Aive roda anúncios pagos de alta conversão para LLCs e Inc.s de brasileiros nos EUA. Você paga apenas por chamada qualificada agendada — $127. Sem investimento em anúncios por sua conta.",
      },
      { property: "og:title", content: "Aive — Crescimento pago por chamada para brasileiros nos EUA" },
      {
        property: "og:description",
        content:
          "6–8 chamadas extras agendadas por mês. $127 por chamada qualificada. Zero risco com investimento em anúncios.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Nav />
      <Hero />
      <LogoStrip />
      <Problem />
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
    <section id="top" className="mx-auto max-w-6xl px-5 pb-12 pt-11 sm:px-6 md:pb-16 md:pt-16">
      <div className="grid items-center gap-12 lg:grid-cols-[0.86fr_1fr] lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65 }}
        >
          <p className="text-xs font-medium text-muted-foreground">
            Para fundadores brasileiros com LLCs e Inc.s nos EUA
          </p>

          <h1 className="mt-5 max-w-lg text-[2.45rem] font-medium leading-[1.08] tracking-tight text-foreground sm:text-[2.75rem] md:text-[3rem]">
            6–8 novos clientes por mês.
            <br />
            Você só paga <span className="font-normal italic">por chamada agendada.</span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Aive roda anúncios pagos de alta conversão para LLCs e Inc.s de brasileiros nos EUA.
            Sem investimento em anúncios por sua conta. Sem mensalidade fixa. Você paga apenas{" "}
            <span className="font-medium text-foreground">
              $127 por chamada qualificada agendada
            </span>
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[var(--glow-brand)] hover:bg-primary/90"
            >
              <Link to="/book-a-call">Agendar sessão</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-10 rounded-lg border-border bg-card px-5 text-sm font-medium text-foreground shadow-none hover:bg-muted"
            >
              <a href="#how">Como funciona</a>
            </Button>
          </div>
        </motion.div>

        <DashboardPreview />
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.75, delay: 0.16 }}
      className="relative mx-auto w-full max-w-[540px]"
    >
      <div className="absolute -right-10 -top-8 -z-10 h-[392px] w-[444px] rounded-full bg-[radial-gradient(closest-side,oklch(0.87_0.1_252/0.44),oklch(0.91_0.065_293/0.24)_48%,transparent_73%)] blur-3xl" />
      <div className="relative">
        <div className="relative overflow-hidden rounded-2xl border border-white/90 shadow-[0_22px_60px_-30px_oklch(0.34_0.06_255/0.34)]">
          <img
            src={roofingHeroPhoto}
            alt="Equipe profissional de telhados instalando telhas em um telhado residencial"
            className="aspect-[3/2] w-full object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-4 flex justify-center sm:inset-x-8">
            <DashboardMetric
              value="$127"
              title="Por chamada agendada."
              subtitle="Sem retenção. Sem contratos. Sem gasto com publicidade."
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardMetric({
  value,
  title,
  subtitle,
}: {
  value: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex w-full max-w-[410px] items-center gap-3 rounded-full border border-white/40 bg-white/55 px-3 py-2.5 shadow-[0_12px_28px_-16px_oklch(0.24_0.03_255/0.36)] backdrop-blur-md">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white sm:text-sm">
        {value}
      </span>
      <div className="min-w-0 pr-2">
        <p className="text-xs font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground sm:text-[11px]">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function LogoStrip() {
  const items = [
    "Donos de LLC",
    "Fundadores de Inc.",
    "Mentores",
    "Agências",
    "Consultores",
    "Comércio eletrônico",
  ];
  return (
    <section className="border-y border-border/65 bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-9 gap-y-3 px-5 py-5 text-sm text-muted-foreground sm:px-6">
        <span className="uppercase tracking-widest text-xs">Quem atendemos:</span>
        {items.map((i) => (
          <span key={i} className="font-medium text-foreground/70">
            {i}
          </span>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  const pains = [
    "Você abriu sua LLC ou Inc., mas o pipeline está parado.",
    "Você já queimou milhares em investimento em anúncios sem resultado real para mostrar.",
    "Agências cobram mensalidades pesadas e ainda não entregam chamadas agendadas.",
    "Você continua dependendo de indicações e mensagens frias.",
  ];
  return (
    <section className="py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            O problema
          </p>
          <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">
            Empresa aberta nos EUA. <span className="text-muted-foreground">Calendário vazio.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Você fez a parte difícil — abriu sua LLC ou Inc., construiu a oferta e preparou o
            produto. Mas rodar anúncios pagos nos EUA sem uma equipe que realmente entende
            conversão é só queimar dinheiro no Meta e no Google.
          </p>
        </div>
        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {pains.map((p) => (
            <div
              key={p}
              className="flex min-h-20 gap-3 rounded-xl border border-border bg-card p-4 shadow-sm shadow-black/[0.03]"
            >
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary">
                !
              </span>
              <span className="text-sm leading-relaxed text-foreground/90">{p}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      icon: <Target className="h-6 w-6" />,
      title: "1. Sessão de estratégia",
      body: "Mapeamos sua oferta, perfil de cliente ideal e o ângulo com potencial de escalar no mercado americano.",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "2. Lançamento em < 7 dias",
      body: "Criativos, texto de venda, página de captura e rastreamento — tudo construído e no ar em menos de uma semana.",
    },
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: "3. Nós cobrimos o investimento em anúncios",
      body: "Você não coloca um dólar em mídia. O risco fica totalmente por nossa conta.",
    },
    {
      icon: <CalendarCheck className="h-6 w-6" />,
      title: "4. Chamadas entram no seu calendário",
      body: "Leads qualificados agendam direto com você. Você paga $127 por chamada que realmente aparece.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Como funciona</p>
        <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">
          Um modelo de agência diferente.
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          Sem mensalidade. Sem taxa de configuração. Sem investimento em anúncios por sua conta.
          Você só paga pelo resultado final: uma chamada agendada.
        </p>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative rounded-2xl border border-border bg-card p-5 shadow-sm shadow-black/[0.03] transition hover:border-primary/30 hover:shadow-md"
          >
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
              {s.icon}
            </div>
            <h3 className="mt-4 text-base font-semibold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const includes = [
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
    <section id="pricing" className="mx-auto max-w-5xl px-5 py-14 sm:px-6 md:py-16">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Preço</p>
        <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">Um preço. Zero surpresas.</h2>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative mt-10 overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-sm shadow-black/[0.04] md:p-10"
      >
        <div className="relative grid items-center gap-9 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> PAGUE POR CHAMADA
            </div>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-4xl font-medium text-foreground md:text-[2.75rem]">$127</span>
              <span className="text-muted-foreground">/ chamada agendada</span>
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Sem mensalidade. Sem custo de configuração. Sem investimento em anúncios por sua
              conta. Se a chamada não cair no seu calendário, você não paga.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-7 h-10 w-full rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[var(--glow-brand)] hover:bg-primary/90 md:w-auto"
            >
              <Link to="/book-a-call">Agendar sessão</Link>
            </Button>
          </div>
          <ul className="space-y-3">
            {includes.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-foreground/90">{i}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </section>
  );
}

function Results() {
  const cases = [
    {
      name: "Lucas R.",
      role: "Coach de inglês — LLC, FL",
      quote: "11 chamadas qualificadas em 3 semanas. Fechei 4. Se paga sozinho e ainda sobra.",
      metric: "+11 chamadas / 21 dias",
    },
    {
      name: "Marina P.",
      role: "Consultoria — Inc., DE",
      quote:
        "Eu estava perdendo $3k/mês com uma agência de mensalidade fixa sem retorno. A Aive entregou 7 chamadas no primeiro mês sem eu gastar um centavo em anúncios.",
      metric: "7 chamadas / mês 1",
    },
    {
      name: "Rafael M.",
      role: "SMMA — LLC, WY",
      quote:
        "Incentivos totalmente alinhados. Eles só ganham se eu ganho. Já são 4 meses e continuam batendo a meta.",
      metric: "8 chamadas/mês em média",
    },
  ];
  return (
    <section id="results" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Resultados</p>
        <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">
          Fundadores brasileiros escalando nos EUA com a Aive.
        </h2>
      </div>
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {cases.map((c) => (
          <div
            key={c.name}
            className="flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm shadow-black/[0.03]"
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              {c.metric}
            </div>
            <p className="mt-4 text-foreground/90 leading-relaxed">"{c.quote}"</p>
            <div className="mt-6 pt-5 border-t border-border">
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-muted-foreground">{c.role}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Como exatamente vocês cobram $127 por chamada?",
      a: "Você só é cobrado quando um lead qualificado agenda uma chamada no seu calendário. Sem agendamento, sem cobrança.",
    },
    {
      q: "Eu preciso pagar o investimento em anúncios?",
      a: "Não. Nós cobrimos 100% do investimento em mídia. Esse risco é nosso — nós só ganhamos quando entregamos chamadas.",
    },
    {
      q: "Em quanto tempo vocês lançam?",
      a: "Entramos no ar em menos de 7 dias após a integração inicial. Criativos, texto de venda, página de captura e rastreamento são construídos pela nossa equipe.",
    },
    {
      q: "Funciona para qualquer nicho?",
      a: "Trabalhamos com LLCs e Inc.s de brasileiros nos EUA — principalmente coaches, agências, consultorias e serviços B2B.",
    },
    {
      q: "E se uma chamada não for qualificada?",
      a: "Chamadas que não atendem aos critérios combinados no início não são cobradas. Definimos isso juntos antes do lançamento.",
    },
    {
      q: "Existe contrato de longo prazo?",
      a: "Não há fidelidade. É mês a mês. Se não estivermos entregando, você sai.",
    },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-14 sm:px-6 md:py-16">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Perguntas frequentes
        </p>
        <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">Perguntas frequentes.</h2>
      </div>
      <div className="mt-9 space-y-3">
        {items.map((it, i) => (
          <FAQItem key={i} {...it} />
        ))}
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm shadow-black/[0.03]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-accent/45"
      >
        <span className="font-semibold">{q}</span>
        <span
          className={`text-xl leading-none text-primary transition-transform ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}

function CTA() {
  return (
    <section id="book" className="mx-auto max-w-5xl px-5 py-14 sm:px-6 md:py-16">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 text-center shadow-sm shadow-black/[0.04] md:p-11">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-2xl font-medium leading-tight md:text-[2rem]">
            Pronto para preencher seu calendário
            <br />
            <span className="italic">com chamadas qualificadas?</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Agende uma sessão estratégica gratuita. Se fizer sentido, lançamos seus anúncios em
            menos de 7 dias — e você não paga um dólar até as chamadas caírem no seu calendário.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-10 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[var(--glow-brand)] hover:bg-primary/90"
          >
            <Link to="/book-a-call">Agendar sessão estratégica</Link>
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
