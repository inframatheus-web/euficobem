import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-10 md:flex-row md:items-center md:px-6">
        <div className="flex flex-col gap-2">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Prova virtual de roupas por IA.
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:gap-8">
          <a
            href="/privacidade"
            className="hover:text-foreground transition-colors"
          >
            Política de Privacidade
          </a>
          <a
            href="/termos"
            className="hover:text-foreground transition-colors"
          >
            Termos de Uso
          </a>
          <span className="text-muted-foreground/80">
            © {new Date().getFullYear()} EuFicoBem
          </span>
        </div>
      </div>
    </footer>
  );
}
