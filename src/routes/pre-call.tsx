import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PlayCircle, CalendarCheck, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AmbientGlow } from "@/components/site/AmbientGlow";

// Replace with the real VSL embed URL (YouTube/Vimeo/Wistia).
const VSL_EMBED_URL =
  "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0&modestbranding=1";

export const Route = createFileRoute("/pre-call")({
  component: PreCallPage,
  head: () => ({
    meta: [
      { title: "Before Our Call — Watch This | Aive" },
      {
        name: "description",
        content:
          "Watch this 7-minute video before our strategy session. We'll walk you through our pay-per-call model and exactly how we get Brazilian-owned US companies 6–8 booked calls per month.",
      },
      { property: "og:title", content: "Before Our Call — Watch This | Aive" },
      {
        property: "og:description",
        content: "7-minute video to make your strategy session 10x more valuable.",
      },
    ],
  }),
});

function PreCallPage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AmbientGlow />
      <Nav />

      <section className="mx-auto max-w-6xl px-6 pt-14 pb-24">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <CalendarCheck className="h-3.5 w-3.5 text-[oklch(0.82_0.17_75)]" />
            You're booked. One more step.
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            Watch this <span className="text-gradient-brand">before our call.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed">
            This 7-minute video walks you through exactly how our pay-per-call model works —
            so we can skip the basics and get straight to your custom plan on the call.
          </p>
        </div>

        {/* VSL */}
        <div className="mt-12 relative mx-auto max-w-4xl">
          <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-brand opacity-20 blur-3xl" />
          <div className="relative rounded-3xl border border-border bg-card/60 backdrop-blur p-3 overflow-hidden">
            <div className="relative w-full overflow-hidden rounded-2xl bg-black" style={{ aspectRatio: "16 / 9" }}>
              <iframe
                src={VSL_EMBED_URL}
                title="Aive — pre-call walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 h-full w-full"
              />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground inline-flex items-center justify-center gap-2 w-full">
            <PlayCircle className="h-4 w-4 text-[oklch(0.82_0.17_75)]" />
            Watch with sound on. Full screen recommended.
          </p>
        </div>

        {/* What you'll learn */}
        <div className="mt-20 grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {[
            { t: "The pay-per-call model", d: "Why we cover ad spend — and how that aligns our incentives 100% with yours." },
            { t: "What we'll need from you", d: "The handful of inputs that make launch in under 7 days possible." },
            { t: "How we qualify calls", d: "The exact criteria for what counts as a billable booked call." },
          ].map((i) => (
            <div key={i.t} className="rounded-2xl border border-border bg-card/40 p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-brand text-primary-foreground">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-bold">{i.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>

        {/* Prepare for call */}
        <div className="mt-20 mx-auto max-w-3xl rounded-3xl border border-border bg-card/50 backdrop-blur p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold">To get the most out of our call:</h2>
          <ul className="mt-6 space-y-3">
            {[
              "Be in a quiet space with a stable internet connection.",
              "Have your offer and current pricing handy.",
              "Know your average monthly revenue and close rate (a rough number is fine).",
              "Bring any past ad results — even if they didn't work.",
              "Show up on time. We respect yours, please respect ours.",
            ].map((x) => (
              <li key={x} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 shrink-0 text-[oklch(0.74_0.18_50)] mt-0.5" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">Need to reschedule?</p>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="mt-4 h-12 px-8 border-border bg-card/30 hover:bg-card"
          >
            <Link to="/book-a-call">
              Pick a new time <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
