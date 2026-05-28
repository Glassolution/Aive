import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/aive-mark.png";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/55 bg-background/86 backdrop-blur-xl">
      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
        <Link to="/" aria-label="Início da Aive" className="inline-flex items-center">
          <img src={logoMark} alt="" className="h-7 w-7 object-contain" />
        </Link>
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-8 text-xs text-muted-foreground md:flex">
          <Link to="/" hash="how" className="hover:text-foreground transition">
            Como funciona
          </Link>
          <Link to="/" hash="pricing" className="hover:text-foreground transition">
            Preços
          </Link>
          <Link to="/" hash="results" className="hover:text-foreground transition">
            Resultados
          </Link>
          <Link to="/" hash="faq" className="hover:text-foreground transition">
            Perguntas frequentes
          </Link>
        </nav>
        <Button
          asChild
          className="h-9 rounded-lg bg-primary px-4 text-xs font-medium text-primary-foreground shadow-none transition hover:bg-primary/90"
        >
          <Link to="/book-a-call">Agendar sessão</Link>
        </Button>
      </div>
    </header>
  );
}
