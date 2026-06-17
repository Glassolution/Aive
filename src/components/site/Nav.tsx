import { Link } from "@tanstack/react-router";
import logoMark from "@/assets/aive-mark.png";
import { Button } from "@/components/ui/button";

export function Nav() {
  return (
    <header className="relative z-40 bg-transparent">
      <div className="mx-auto flex h-[96px] max-w-[1320px] items-center justify-between gap-8 px-5 sm:px-6 lg:px-0">
        <Link to="/" aria-label="Início da Aive" className="inline-flex items-center">
          <span className="inline-flex items-center gap-3">
            <img src={logoMark} alt="" className="h-9 w-9 object-contain" />
            <span className="font-display text-[2rem] font-medium leading-none tracking-[-0.04em] text-foreground">
              Aive
            </span>
          </span>
        </Link>
        <nav className="hidden flex-1 items-center justify-end gap-8 text-[15px] font-medium text-muted-foreground md:flex">
          <Link to="/" hash="how" className="transition hover:text-foreground">
            Como Funciona
          </Link>
          <Link to="/" hash="benefits" className="transition hover:text-foreground">
            Benefícios
          </Link>
          <Link to="/" hash="results" className="transition hover:text-foreground">
            Resultados
          </Link>
          <Link to="/" hash="pricing" className="transition hover:text-foreground">
            Preços
          </Link>
          <Link to="/" hash="faq" className="transition hover:text-foreground">
            FAQ
          </Link>
        </nav>
        <Button
          asChild
          className="h-14 shrink-0 rounded-full bg-[#111722] px-8 text-[14px] font-semibold text-white shadow-none transition hover:bg-[#1a2230]"
        >
          <Link to="/book-a-call">Agendar sessão</Link>
        </Button>
      </div>
    </header>
  );
}
