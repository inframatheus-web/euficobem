import { ChevronDown } from "lucide-react";

const faqs = [
  {
    q: "É gratuito mesmo?",
    a: "É. Você pode usar quantas vezes quiser, sem cadastro e sem cartão. No futuro talvez lancemos recursos extras pagos, mas a prova virtual vai continuar gratuita.",
  },
  {
    q: "Minha foto fica salva?",
    a: "Não. A imagem é processada na hora e descartada imediatamente. Não guardamos nem a sua foto nem a foto da peça.",
  },
  {
    q: "O resultado é preciso?",
    a: "Na maioria dos casos sim, mas é uma prova virtual por IA — pode haver pequenas variações de caimento, textura ou tonalidade em relação ao produto real.",
  },
  {
    q: "Funciona com qualquer tipo de roupa?",
    a: "Funciona melhor com peças comuns do dia a dia (camisetas, blusas, vestidos, jaquetas). Peças com estampas muito complexas ou acessórios podem sair com menos fidelidade.",
  },
];

export function FAQ() {
  return (
    <section
      id="faq"
      className="mx-auto w-full max-w-3xl px-4 py-16 md:px-6 md:py-20"
    >
      <div className="text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          Perguntas frequentes
        </h2>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          Tudo o que você precisa saber antes de experimentar.
        </p>
      </div>

      <div className="mt-10 space-y-3">
        {faqs.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)] open:bg-primary-50/50 open:border-primary-200 transition-colors"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium text-foreground">
              {item.q}
              <ChevronDown className="h-4 w-4 shrink-0 text-primary-600 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
