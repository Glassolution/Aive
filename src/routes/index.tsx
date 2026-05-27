import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import logo from "@/assets/aive-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  CheckCircle2,
  CalendarCheck,
  DollarSign,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Globe2,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Aive — 6–8 Booked Calls/Month for US-Based Brazilian Founders" },
      {
        name: "description",
        content:
          "Aive runs high-converting paid ads for Brazilian-owned LLCs & Inc.s in the US. Pay only per booked qualified call — $127. No ad spend on you.",
      },
      { property: "og:title", content: "Aive — Pay-Per-Call Growth for US Brazilian Founders" },
      {
        property: "og:description",
        content: "6–8 extra booked calls/month. $127 per qualified call. Zero ad spend risk.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AmbientGlow />
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

function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.74_0.18_50/0.25),transparent)] blur-3xl" />
      <div className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(closest-side,oklch(0.62_0.22_30/0.18),transparent)] blur-3xl" />
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2">
          <img src={logo} alt="Aive" className="h-9 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground transition">How it works</a>
          <a href="#pricing" className="hover:text-foreground transition">Pricing</a>
          <a href="#results" className="hover:text-foreground transition">Results</a>
          <a href="#faq" className="hover:text-foreground transition">FAQ</a>
        </nav>
        <Button asChild className="bg-gradient-brand text-primary-foreground hover:opacity-90 font-semibold">
          <a href="#book">Book a call <ArrowRight className="ml-1 h-4 w-4" /></a>
        </Button>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative mx-auto max-w-7xl px-6 pt-20 pb-28 md:pt-32 md:pb-36">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-4xl text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
          <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.18_50)] animate-pulse" />
          Para brasileiros com LLC ou Inc. nos EUA
        </div>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
          6–8 clientes a mais por mês.
          <br />
          <span className="text-gradient-brand">Você só paga pelas calls.</span>
        </h1>

        <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A Aive roda anúncios de alta conversão para empresas brasileiras nos EUA.
          Sem ad spend do seu bolso. Sem mensalidade. Você paga apenas{" "}
          <span className="text-foreground font-semibold">$127 por call agendada e qualificada</span>.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-brand text-primary-foreground hover:opacity-90 font-semibold h-14 px-8 text-base shadow-[var(--glow-brand)]"
          >
            <a href="#book">
              Quero receber 6–8 calls/mês <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 px-8 text-base border-border bg-card/30 hover:bg-card"
          >
            <a href="#how">Como funciona</a>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <Badge icon={<ShieldCheck className="h-4 w-4" />} text="Sem risco de ad spend" />
          <Badge icon={<Zap className="h-4 w-4" />} text="Launch em até 7 dias" />
          <Badge icon={<DollarSign className="h-4 w-4" />} text="Pay-per-result" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mt-20 mx-auto max-w-5xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat n="6–8" label="novas calls/mês" />
          <Stat n="$127" label="por call agendada" />
          <Stat n="$0" label="ad spend do seu lado" />
          <Stat n="<7d" label="para ir ao ar" />
        </div>
      </motion.div>
    </section>
  );
}

function Badge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="text-[oklch(0.82_0.17_75)]">{icon}</span>
      {text}
    </span>
  );
}

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card/40 backdrop-blur p-6 text-center">
      <div className="text-3xl md:text-4xl font-bold font-display text-gradient-brand">{n}</div>
      <div className="mt-1 text-xs md:text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function LogoStrip() {
  const items = ["LLC owners", "Inc. founders", "Coaches", "Agências", "Consultorias", "E-commerce"];
  return (
    <section className="border-y border-border/50 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
        <span className="uppercase tracking-widest text-xs">Quem atendemos:</span>
        {items.map((i) => (
          <span key={i} className="font-medium text-foreground/70">{i}</span>
        ))}
      </div>
    </section>
  );
}

function Problem() {
  const pains = [
    "Você abriu sua LLC ou Inc. mas o pipeline está vazio.",
    "Já queimou milhares em ad spend sem ver retorno.",
    "Agências cobram retainer alto e não entregam calls.",
    "Está dependendo só de indicação e DM no Instagram.",
  ];
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">O problema</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            Brasileiro com empresa nos EUA<br />
            <span className="text-muted-foreground">e agenda vazia.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            Você fez a parte difícil — abriu a empresa, tem o produto, tem oferta.
            Mas tráfego pago no mercado americano sem um time que entende conversão é
            queimar dinheiro com Mark Zuckerberg.
          </p>
        </div>
        <div className="space-y-3">
          {pains.map((p) => (
            <div key={p} className="flex gap-3 rounded-xl border border-border bg-card/40 p-4">
              <span className="mt-0.5 h-6 w-6 shrink-0 rounded-full bg-[oklch(0.62_0.22_30/0.15)] text-[oklch(0.74_0.18_50)] inline-flex items-center justify-center text-xs font-bold">!</span>
              <span className="text-foreground/90">{p}</span>
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
      title: "1. Strategy call",
      body: "Mapeamos sua oferta, ICP e o ângulo que vai escalar no mercado americano.",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "2. Launch em <7 dias",
      body: "Criativos, copy, landing e tracking — tudo pronto. A gente coloca no ar.",
    },
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: "3. Nós pagamos o ad spend",
      body: "Você não coloca um dólar em mídia. O risco é todo nosso.",
    },
    {
      icon: <CalendarCheck className="h-6 w-6" />,
      title: "4. Calls aparecem na sua agenda",
      body: "Leads qualificados agendam direto. Você paga $127 por call que aparece.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">Como funciona</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">Um modelo diferente de agência.</h2>
        <p className="mt-5 text-lg text-muted-foreground">
          Sem retainer. Sem fee de setup. Sem ad spend. Você só paga pelo resultado final: uma call agendada.
        </p>
      </div>
      <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group relative rounded-2xl border border-border bg-card/40 p-6 hover:border-[oklch(0.74_0.18_50/0.5)] transition"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
              {s.icon}
            </div>
            <h3 className="mt-5 text-lg font-bold">{s.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function Pricing() {
  const includes = [
    "Estratégia de oferta + ICP",
    "Criativos (vídeo + estático) ilimitados",
    "Landing page de alta conversão",
    "Setup de pixel, tracking e CRM",
    "Gestão completa de Meta Ads & Google",
    "Ad spend por nossa conta",
    "Otimização semanal + reporting",
    "Cobrança apenas em calls qualificadas",
  ];
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">Pricing</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">Um preço. Zero surpresa.</h2>
      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12 relative rounded-3xl border border-border bg-card/60 backdrop-blur p-10 md:p-14 overflow-hidden"
      >
        <div className="absolute -top-32 -right-32 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[oklch(0.74_0.18_50/0.15)] text-[oklch(0.82_0.17_75)] px-3 py-1 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5" /> PAY-PER-CALL
            </div>
            <div className="mt-6 flex items-baseline gap-2">
              <span className="text-7xl md:text-8xl font-bold text-gradient-brand">$127</span>
              <span className="text-muted-foreground">/ call agendada</span>
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Sem mensalidade. Sem fee de setup. Sem ad spend do seu lado.
              Se a call não aparecer na sua agenda, você não paga.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-gradient-brand text-primary-foreground hover:opacity-90 font-semibold h-14 px-8 w-full md:w-auto shadow-[var(--glow-brand)]"
            >
              <a href="#book">Começar agora <ArrowRight className="ml-2 h-5 w-5" /></a>
            </Button>
          </div>
          <ul className="space-y-3">
            {includes.map((i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[oklch(0.74_0.18_50)] mt-0.5" />
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
    { name: "Lucas R.", role: "Coach de inglês — LLC FL", quote: "Em 3 semanas, 11 calls qualificadas. Fechei 4. Pago tudo da minha cota de booked calls e ainda sobra.", metric: "+11 calls / 21d" },
    { name: "Marina P.", role: "Consultoria — Inc. DE", quote: "Cansei de pagar agência R$15k/mês sem retorno. Aive entregou 7 calls no primeiro mês, sem eu colocar grana em ads.", metric: "7 calls / mês 1" },
    { name: "Rafael M.", role: "Agência SMMA — LLC WY", quote: "Modelo 100% alinhado. Eles só ganham se eu ganhar. Já são 4 meses batendo a meta.", metric: "8 calls/mês avg" },
  ];
  return (
    <section id="results" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">Resultados</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">Brasileiros nos EUA escalando com a Aive.</h2>
      </div>
      <div className="mt-14 grid md:grid-cols-3 gap-5">
        {cases.map((c) => (
          <div key={c.name} className="rounded-2xl border border-border bg-card/40 p-7 flex flex-col">
            <div className="text-xs font-semibold text-[oklch(0.82_0.17_75)] uppercase tracking-widest">{c.metric}</div>
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
    { q: "Como vocês cobram exatamente $127 por call?", a: "Você é cobrado apenas quando um lead qualificado agenda uma call no seu calendário. Sem agendamento = sem cobrança." },
    { q: "Preciso pagar ad spend?", a: "Não. Cobrimos 100% do investimento em mídia. Esse é o nosso risco — só ganhamos quando entregamos calls." },
    { q: "Em quanto tempo lança?", a: "Lançamos em até 7 dias após o onboarding. Criativos, copy, landing page e tracking são feitos pelo nosso time." },
    { q: "Funciona pra qualquer nicho?", a: "Atendemos brasileiros com LLC ou Inc. nos EUA — coaches, agências, consultorias, infoprodutos e serviços B2B principalmente." },
    { q: "E se a call não for qualificada?", a: "Calls que não batem o critério acordado no kickoff não são cobradas. Definimos isso juntos antes do launch." },
    { q: "Tem fidelidade ou contrato longo?", a: "Não. Modelo mensal. Se não estiver entregando, você sai." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">FAQ</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">Perguntas frequentes.</h2>
      </div>
      <div className="mt-12 space-y-3">
        {items.map((it, i) => <FAQItem key={i} {...it} />)}
      </div>
    </section>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card/40 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-card/60 transition"
      >
        <span className="font-semibold">{q}</span>
        <span className={`text-[oklch(0.82_0.17_75)] text-2xl leading-none transition-transform ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      {open && <div className="px-5 pb-5 text-muted-foreground leading-relaxed">{a}</div>}
    </div>
  );
}

function CTA() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section id="book" className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative rounded-[2rem] border border-border bg-card/60 backdrop-blur overflow-hidden p-8 md:p-14">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.74_0.18_50/0.2),transparent_60%)]" />
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Pronto pra encher a agenda<br />
              <span className="text-gradient-brand">com calls qualificadas?</span>
            </h2>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Aplique abaixo. Se for fit, a gente lança a operação em até 7 dias.
              Você não paga nada até a primeira call cair na sua agenda.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {["Sem ad spend do seu bolso", "Sem retainer mensal", "Launch em <7 dias", "$127 só por call qualificada"].map((x) => (
                <li key={x} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[oklch(0.74_0.18_50)]" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="rounded-2xl border border-border bg-background/70 backdrop-blur p-6 md:p-8 space-y-4"
          >
            {submitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto h-14 w-14 rounded-full bg-gradient-brand inline-flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="mt-5 text-2xl font-bold">Aplicação recebida!</h3>
                <p className="mt-2 text-muted-foreground">Nosso time entra em contato em até 24h.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold">Aplique para trabalhar com a Aive</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Nome">
                    <Input required placeholder="Seu nome" className="bg-card/50 border-border h-11" />
                  </Field>
                  <Field label="Email">
                    <Input required type="email" placeholder="voce@empresa.com" className="bg-card/50 border-border h-11" />
                  </Field>
                </div>
                <Field label="Nome da empresa (LLC / Inc.)">
                  <Input required placeholder="Acme LLC" className="bg-card/50 border-border h-11" />
                </Field>
                <Field label="Faturamento mensal aproximado">
                  <Input required placeholder="$10k – $50k MRR" className="bg-card/50 border-border h-11" />
                </Field>
                <Field label="O que você vende?">
                  <Textarea required rows={3} placeholder="Conta rápido sobre sua oferta e ticket médio" className="bg-card/50 border-border" />
                </Field>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-gradient-brand text-primary-foreground hover:opacity-90 font-semibold h-14 text-base shadow-[var(--glow-brand)]"
                >
                  Enviar aplicação <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <p className="text-xs text-muted-foreground text-center">Resposta em até 24 horas úteis.</p>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/50 mt-12">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Aive" className="h-8 w-auto" />
          <span className="text-sm text-muted-foreground">© {new Date().getFullYear()} Aive. All rights reserved.</span>
        </div>
        <div className="text-sm text-muted-foreground">Built for Brazilian founders in the US 🇧🇷 🇺🇸</div>
      </div>
    </footer>
  );
}
