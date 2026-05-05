import { ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 60% at 20% 10%, rgba(124,148,115,0.15), transparent 70%), radial-gradient(50% 50% at 90% 30%, rgba(214,167,122,0.12), transparent 70%)",
        }}
      />
      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 md:grid-cols-2 md:gap-16 md:px-6 md:py-24">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700">
            <Sparkles className="h-3.5 w-3.5" />
            Prova virtual por IA
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Veja como essa roupa vai ficar{" "}
            <span className="text-primary-600">em você</span> antes de comprar.
          </h1>
          <p className="mt-5 max-w-lg text-base text-muted-foreground md:text-lg">
            Envie uma foto da peça e uma foto sua. Em segundos você vê o
            resultado real. Grátis.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href="#experimentar"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary-600 transition-colors"
            >
              Experimentar agora
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center rounded-full border border-border bg-surface px-6 py-3.5 text-base font-medium text-foreground hover:border-primary-300 transition-colors"
            >
              Como funciona
            </a>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-primary-600" />
            Sem cadastro · Suas fotos não ficam salvas
          </div>
        </div>

        <div className="relative animate-fade-in">
          <HeroPreview />
        </div>
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md">
      <div
        className="absolute inset-0 rotate-[-3deg] rounded-3xl bg-primary-100"
        aria-hidden
      />
      <div className="absolute inset-0 rotate-[2deg] rounded-3xl bg-surface shadow-[var(--shadow-soft)] overflow-hidden border border-border">
        <div className="grid h-full grid-cols-2">
          <PreviewPane label="A peça" tone="garment" />
          <PreviewPane label="Em você" tone="result" />
        </div>
      </div>
    </div>
  );
}

function PreviewPane({
  label,
  tone,
}: {
  label: string;
  tone: "garment" | "result";
}) {
  const bg =
    tone === "garment"
      ? "linear-gradient(160deg, #e3e9de 0%, #c7d2bc 100%)"
      : "linear-gradient(160deg, #f4f6f2 0%, #a9ba9d 100%)";

  return (
    <div className="relative flex flex-col justify-end p-5" style={{ background: bg }}>
      <div className="absolute inset-0 grid place-items-center">
        <PlaceholderFigure tone={tone} />
      </div>
      <span className="relative z-10 inline-flex w-fit items-center rounded-full bg-surface/90 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
        {label}
      </span>
    </div>
  );
}

function PlaceholderFigure({ tone }: { tone: "garment" | "result" }) {
  if (tone === "garment") {
    return (
      <svg
        viewBox="0 0 120 140"
        className="h-32 w-32 opacity-60"
        aria-hidden
      >
        <path
          d="M30 28 L50 18 Q60 28 70 18 L90 28 L100 55 L82 62 L82 122 L38 122 L38 62 L20 55 Z"
          fill="#7c9473"
          opacity="0.85"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 160" className="h-40 w-40 opacity-70" aria-hidden>
      <circle cx="60" cy="34" r="16" fill="#4a5e44" />
      <path
        d="M30 78 Q60 52 90 78 L92 130 L28 130 Z"
        fill="#5f7757"
      />
      <rect x="42" y="128" width="10" height="22" rx="4" fill="#4a5e44" />
      <rect x="68" y="128" width="10" height="22" rx="4" fill="#4a5e44" />
    </svg>
  );
}
