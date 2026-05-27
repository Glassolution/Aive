import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import logo from "@/assets/aive-logo.png";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-background/70 border-b border-border/50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Aive" className="h-9 w-auto" />
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link to="/" hash="how" className="hover:text-foreground transition">How it works</Link>
          <Link to="/" hash="pricing" className="hover:text-foreground transition">Pricing</Link>
          <Link to="/" hash="results" className="hover:text-foreground transition">Results</Link>
          <Link to="/" hash="faq" className="hover:text-foreground transition">FAQ</Link>
        </nav>
        <Button asChild className="bg-gradient-brand text-primary-foreground hover:opacity-90 font-semibold">
          <Link to="/book-a-call">Book strategy session <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </div>
    </header>
  );
}
