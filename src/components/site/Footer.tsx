import logo from "@/assets/aive-logo.png";

export function Footer() {
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
