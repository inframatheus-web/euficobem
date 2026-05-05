import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-6">
        <Logo />
        <nav className="flex items-center gap-6 text-sm text-muted-foreground">
          <a
            href="#como-funciona"
            className="hidden sm:inline-block hover:text-foreground transition-colors"
          >
            Como funciona
          </a>
          <a
            href="#faq"
            className="hidden sm:inline-block hover:text-foreground transition-colors"
          >
            FAQ
          </a>
          <a
            href="#experimentar"
            className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-600 transition-colors"
          >
            Experimentar
          </a>
        </nav>
      </div>
    </header>
  );
}
