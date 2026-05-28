import logoMark from "@/assets/aive-mark.png";

export function Footer() {
  return (
    <footer className="mt-6 border-t border-border/70 bg-card/45">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <img src={logoMark} alt="" className="h-7 w-7 object-contain" />
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Aive. Todos os direitos reservados.
          </span>
        </div>
        <div className="text-sm text-muted-foreground">
          Criado para fundadores brasileiros nos EUA.
        </div>
      </div>
    </footer>
  );
}
