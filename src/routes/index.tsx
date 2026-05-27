import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AmbientGlow } from "@/components/site/AmbientGlow";
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
          For Brazilian founders with US-based LLCs & Inc.s
        </div>

        <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-[1.05] tracking-tight">
          6–8 new clients per month.
          <br />
          <span className="text-gradient-brand">You only pay per booked call.</span>
        </h1>

        <p className="mt-7 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Aive runs high-converting paid ads for Brazilian-owned LLCs & Inc.s in the US.
          No ad spend on you. No monthly retainer. You only pay{" "}
          <span className="text-foreground font-semibold">$127 per qualified booked call</span>.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="bg-gradient-brand text-primary-foreground hover:opacity-90 font-semibold h-14 px-8 text-base shadow-[var(--glow-brand)]"
          >
            <Link to="/book-a-call">
              Book a strategy session <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 px-8 text-base border-border bg-card/30 hover:bg-card"
          >
            <a href="#how">How it works</a>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
          <Badge icon={<ShieldCheck className="h-4 w-4" />} text="Zero ad spend risk" />
          <Badge icon={<Zap className="h-4 w-4" />} text="Launch in < 7 days" />
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
          <Stat n="6–8" label="new calls/month" />
          <Stat n="$127" label="per booked call" />
          <Stat n="$0" label="ad spend on you" />
          <Stat n="<7d" label="to go live" />
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
  const items = ["LLC owners", "Inc. founders", "Coaches", "Agencies", "Consultants", "E-commerce"];
  return (
    <section className="border-y border-border/50 bg-card/20">
      <div className="mx-auto max-w-7xl px-6 py-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-muted-foreground">
        <span className="uppercase tracking-widest text-xs">Who we serve:</span>
        {items.map((i) => (
          <span key={i} className="font-medium text-foreground/70">{i}</span>
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
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">The problem</p>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold">
            US company set up.<br />
            <span className="text-muted-foreground">Calendar empty.</span>
          </h2>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            You did the hard part — opened your LLC or Inc., built the offer, lined up the product.
            But running paid ads in the US without a team who actually understands conversion
            is just burning money on Meta and Google.
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
    <section id="how" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">How it works</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">A different kind of agency model.</h2>
        <p className="mt-5 text-lg text-muted-foreground">
          No retainer. No setup fee. No ad spend on you. You only pay for the end result: a booked call.
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
    <section id="pricing" className="mx-auto max-w-5xl px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">Pricing</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">One price. Zero surprises.</h2>
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
              <span className="text-muted-foreground">/ booked call</span>
            </div>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              No monthly fee. No setup cost. No ad spend on you.
              If the call doesn't land on your calendar, you don't pay.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-gradient-brand text-primary-foreground hover:opacity-90 font-semibold h-14 px-8 w-full md:w-auto shadow-[var(--glow-brand)]"
            >
              <Link to="/book-a-call">Book a strategy session <ArrowRight className="ml-2 h-5 w-5" /></Link>
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
    { name: "Lucas R.", role: "English coach — LLC, FL", quote: "11 qualified calls in 3 weeks. Closed 4. Pays for itself and then some.", metric: "+11 calls / 21d" },
    { name: "Marina P.", role: "Consulting — Inc., DE", quote: "I was bleeding $3k/mo on a retainer agency for nothing. Aive delivered 7 calls in month one without me spending a cent on ads.", metric: "7 calls / month 1" },
    { name: "Rafael M.", role: "SMMA — LLC, WY", quote: "Incentives fully aligned. They only win if I win. 4 months in and they keep hitting the number.", metric: "8 calls/mo avg" },
  ];
  return (
    <section id="results" className="mx-auto max-w-7xl px-6 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">Results</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">Brazilian founders scaling in the US with Aive.</h2>
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
    { q: "How exactly do you charge $127 per call?", a: "You're billed only when a qualified lead books a call on your calendar. No booking, no charge." },
    { q: "Do I have to pay ad spend?", a: "No. We cover 100% of the media spend. That's our risk — we only win when we deliver calls." },
    { q: "How fast do you launch?", a: "Live in under 7 days after onboarding. Creatives, copy, landing page and tracking are built by our team." },
    { q: "Does it work for any niche?", a: "We work with Brazilian-owned LLCs and Inc.s in the US — primarily coaches, agencies, consulting and B2B services." },
    { q: "What if a call isn't qualified?", a: "Calls that don't meet the criteria agreed at kickoff are not billed. We define this together before launch." },
    { q: "Any long-term contract?", a: "No lock-in. Month-to-month. If we're not delivering, you walk." },
  ];
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-[oklch(0.82_0.17_75)]">FAQ</p>
        <h2 className="mt-4 text-4xl md:text-5xl font-bold">Frequently asked questions.</h2>
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
  return (
    <section id="book" className="mx-auto max-w-6xl px-6 py-24">
      <div className="relative rounded-[2rem] border border-border bg-card/60 backdrop-blur overflow-hidden p-10 md:p-16 text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,oklch(0.74_0.18_50/0.2),transparent_60%)]" />
        <div className="mx-auto max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Ready to fill your calendar<br />
            <span className="text-gradient-brand">with qualified calls?</span>
          </h2>
          <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
            Book a free strategy session. If we're a fit, we launch your ads in under 7 days —
            and you don't pay a dollar until calls land on your calendar.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-9 bg-gradient-brand text-primary-foreground hover:opacity-90 font-semibold h-14 px-10 text-base shadow-[var(--glow-brand)]"
          >
            <Link to="/book-a-call">
              Book your strategy session <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[oklch(0.74_0.18_50)]" /> No ad spend on you</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[oklch(0.74_0.18_50)]" /> No retainer</span>
            <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-[oklch(0.74_0.18_50)]" /> Launch in &lt; 7 days</span>
          </div>
        </div>
      </div>
    </section>
  );
}
