import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { CheckCircle2, ShieldCheck, Zap, DollarSign, ArrowRight } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { AmbientGlow } from "@/components/site/AmbientGlow";

// Real Aive Calendly link.
const CALENDLY_URL = "https://calendly.com/lucassrby";

export const Route = createFileRoute("/book-a-call")({
  component: BookACallPage,
  head: () => ({
    meta: [
      { title: "Book Your Strategy Session — Aive" },
      {
        name: "description",
        content:
          "Pick a time for your free 30-minute strategy session with Aive. We'll map your offer, audience and the fastest path to 6–8 booked calls per month.",
      },
      { property: "og:title", content: "Book Your Strategy Session — Aive" },
      {
        property: "og:description",
        content: "Free 30-min call. We'll show you the path to 6–8 booked calls/month.",
      },
    ],
  }),
});

function BookACallPage() {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <AmbientGlow />
      <Nav />

      <section className="mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-[oklch(0.74_0.18_50)] animate-pulse" />
            Free 30-minute strategy session
          </div>
          <h1 className="mt-6 text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight">
            Pick a time that works.<br />
            <span className="text-gradient-brand">We'll handle the rest.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            On this call we'll map your offer, audience and ad angle — then walk you through
            exactly how we'd get you to 6–8 booked calls per month.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1fr_2fr] gap-8 items-start">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-border bg-card/50 backdrop-blur p-7 sticky top-24">
            <h2 className="text-lg font-bold">What to expect</h2>
            <ul className="mt-5 space-y-4 text-sm">
              {[
                { t: "30 minutes, on Zoom", d: "Show up on time. We respect yours." },
                { t: "Offer & funnel audit", d: "We pressure-test your offer and ad angle." },
                { t: "Custom 90-day plan", d: "If we're a fit, you leave with the path to 6–8 calls/month." },
                { t: "Zero pressure", d: "No high-pressure pitch. Just clarity." },
              ].map((i) => (
                <li key={i.t} className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-[oklch(0.74_0.18_50)] mt-0.5" />
                  <div>
                    <div className="font-semibold">{i.t}</div>
                    <div className="text-muted-foreground">{i.d}</div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-7 pt-6 border-t border-border space-y-3 text-sm text-muted-foreground">
              <p className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[oklch(0.82_0.17_75)]" /> Zero ad spend risk</p>
              <p className="inline-flex items-center gap-2"><Zap className="h-4 w-4 text-[oklch(0.82_0.17_75)]" /> Launch in &lt; 7 days</p>
              <p className="inline-flex items-center gap-2"><DollarSign className="h-4 w-4 text-[oklch(0.82_0.17_75)]" /> Pay only per booked call</p>
            </div>
          </aside>

          {/* Calendly */}
          <div className="rounded-2xl border border-border bg-card/40 backdrop-blur overflow-hidden">
            <div
              className="calendly-inline-widget"
              data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=141414&text_color=ffffff&primary_color=f59e0b`}
              style={{ minWidth: "320px", height: "780px" }}
            />
          </div>
        </div>

        <div className="mt-12 text-center text-sm text-muted-foreground">
          Already booked?{" "}
          <Link to="/pre-call" className="text-[oklch(0.82_0.17_75)] font-semibold inline-flex items-center gap-1 hover:underline">
            Watch the pre-call video <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
