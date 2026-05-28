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
            For Brazilian founders with US-based LLCs & Inc.s
          </p>

          <h1 className="mt-5 max-w-lg text-[2.45rem] font-medium leading-[1.08] tracking-tight text-foreground sm:text-[2.75rem] md:text-[3rem]">
            6–8 new clients per month.
            <br />
            You only pay <span className="font-normal italic">per booked call.</span>
          </h1>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
            Aive runs high-converting paid ads for Brazilian-owned LLCs & Inc.s in the US. No ad
            spend on you. No monthly retainer. You only pay{" "}
            <span className="font-medium text-foreground">$127 per qualified booked call</span>.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-10 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[var(--glow-brand)] hover:bg-primary/90"
            >
              <Link to="/book-a-call">Book a strategy session</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-10 rounded-lg border-border bg-card px-5 text-sm font-medium text-foreground shadow-none hover:bg-muted"
            >
              <a href="#how">How it works</a>
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
            alt="Professional roofing crew installing shingles on a residential roof"
            className="aspect-[3/2] w-full object-cover object-center"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/10 to-transparent" />
          <div className="absolute inset-x-5 bottom-4 flex justify-center sm:inset-x-8">
            <DashboardMetric
              value="$127"
              title="Por call agendada."
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
  const items = ["LLC owners", "Inc. founders", "Coaches", "Agencies", "Consultants", "E-commerce"];
  return (
    <section className="border-y border-border/65 bg-card">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-9 gap-y-3 px-5 py-5 text-sm text-muted-foreground sm:px-6">
        <span className="uppercase tracking-widest text-xs">Who we serve:</span>
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
    "You opened your LLC or Inc. but the pipeline is dry.",
    "You've burned thousands in ad spend with nothing to show for it.",
    "Agencies charge fat retainers and still don't deliver booked calls.",
    "You're stuck relying on referrals and cold DMs.",
  ];
  return (
    <section className="py-14 md:py-16">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            The problem
          </p>
          <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">
            US company set up. <span className="text-muted-foreground">Calendar empty.</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            You did the hard part — opened your LLC or Inc., built the offer, lined up the product.
            But running paid ads in the US without a team who actually understands conversion is
            just burning money on Meta and Google.
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
      title: "1. Strategy call",
      body: "We map your offer, ICP and the angle that will scale in the US market.",
    },
    {
      icon: <Rocket className="h-6 w-6" />,
      title: "2. Launch in < 7 days",
      body: "Creatives, copy, landing page, tracking — all built and live in under a week.",
    },
    {
      icon: <Globe2 className="h-6 w-6" />,
      title: "3. We cover ad spend",
      body: "You don't put a dollar into media. The risk is entirely on us.",
    },
    {
      icon: <CalendarCheck className="h-6 w-6" />,
      title: "4. Calls hit your calendar",
      body: "Qualified leads book directly. You pay $127 per call that actually shows up.",
    },
  ];
  return (
    <section id="how" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">How it works</p>
        <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">
          A different kind of agency model.
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          No retainer. No setup fee. No ad spend on you. You only pay for the end result: a booked
          call.
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
    "Offer + ICP strategy",
    "Unlimited video & static creatives",
    "High-converting landing page",
    "Pixel, tracking & CRM setup",
    "Full Meta Ads & Google management",
    "Ad spend on us",
    "Weekly optimization + reporting",
    "Billed only for qualified booked calls",
  ];
  return (
    <section id="pricing" className="mx-auto max-w-5xl px-5 py-14 sm:px-6 md:py-16">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Pricing</p>
        <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">One price. Zero surprises.</h2>
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
              <Sparkles className="h-3.5 w-3.5" /> PAY-PER-CALL
            </div>
            <div className="mt-5 flex items-baseline gap-2">
              <span className="text-4xl font-medium text-foreground md:text-[2.75rem]">$127</span>
              <span className="text-muted-foreground">/ booked call</span>
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              No monthly fee. No setup cost. No ad spend on you. If the call doesn't land on your
              calendar, you don't pay.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-7 h-10 w-full rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground shadow-[var(--glow-brand)] hover:bg-primary/90 md:w-auto"
            >
              <Link to="/book-a-call">Book a strategy session</Link>
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
      role: "English coach — LLC, FL",
      quote: "11 qualified calls in 3 weeks. Closed 4. Pays for itself and then some.",
      metric: "+11 calls / 21d",
    },
    {
      name: "Marina P.",
      role: "Consulting — Inc., DE",
      quote:
        "I was bleeding $3k/mo on a retainer agency for nothing. Aive delivered 7 calls in month one without me spending a cent on ads.",
      metric: "7 calls / month 1",
    },
    {
      name: "Rafael M.",
      role: "SMMA — LLC, WY",
      quote:
        "Incentives fully aligned. They only win if I win. 4 months in and they keep hitting the number.",
      metric: "8 calls/mo avg",
    },
  ];
  return (
    <section id="results" className="mx-auto max-w-6xl px-5 py-14 sm:px-6 md:py-16">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">Results</p>
        <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">
          Brazilian founders scaling in the US with Aive.
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
      q: "How exactly do you charge $127 per call?",
      a: "You're billed only when a qualified lead books a call on your calendar. No booking, no charge.",
    },
    {
      q: "Do I have to pay ad spend?",
      a: "No. We cover 100% of the media spend. That's our risk — we only win when we deliver calls.",
    },
    {
      q: "How fast do you launch?",
      a: "Live in under 7 days after onboarding. Creatives, copy, landing page and tracking are built by our team.",
    },
    {
      q: "Does it work for any niche?",
      a: "We work with Brazilian-owned LLCs and Inc.s in the US — primarily coaches, agencies, consulting and B2B services.",
    },
    {
      q: "What if a call isn't qualified?",
      a: "Calls that don't meet the criteria agreed at kickoff are not billed. We define this together before launch.",
    },
    {
      q: "Any long-term contract?",
      a: "No lock-in. Month-to-month. If we're not delivering, you walk.",
    },
  ];
  return (
    <section id="faq" className="mx-auto max-w-3xl px-5 py-14 sm:px-6 md:py-16">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">FAQ</p>
        <h2 className="mt-3 text-2xl font-medium md:text-[2rem]">Frequently asked questions.</h2>
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
            Ready to fill your calendar
            <br />
            <span className="italic">with qualified calls?</span>
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Book a free strategy session. If we're a fit, we launch your ads in under 7 days — and
            you don't pay a dollar until calls land on your calendar.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 h-10 rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[var(--glow-brand)] hover:bg-primary/90"
          >
            <Link to="/book-a-call">Book your strategy session</Link>
          </Button>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> No ad spend on you
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> No retainer
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary" /> Launch in &lt; 7 days
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
