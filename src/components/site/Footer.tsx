import logoMark from "@/assets/aive-mark.png";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <img src={logoMark} alt="" className="h-7 w-7 object-contain" />
          <span className="font-display text-2xl font-medium tracking-[-0.05em] text-foreground">
            Aive
          </span>
        </div>
        <div className="text-center text-sm text-muted-foreground md:text-right">
          © {new Date().getFullYear()} Aive. Design focado em performance para fundadores
          brasileiros nos EUA.
        </div>
      </div>
    </footer>
  );
}
