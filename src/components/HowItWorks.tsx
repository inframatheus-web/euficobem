import { Shirt, Camera, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Shirt,
    title: "Envie a peça",
    description:
      "Salve a imagem da roupa direto da loja ou tire uma foto do produto.",
  },
  {
    icon: Camera,
    title: "Envie sua foto",
    description:
      "Uma foto sua de corpo inteiro, de frente, com boa iluminação.",
  },
  {
    icon: Sparkles,
    title: "Veja o resultado",
    description:
      "Em segundos a IA gera a imagem de você vestindo aquela peça.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="bg-primary-50/60 border-y border-border"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Três passos, resultado na hora
          </h2>
          <p className="mt-3 text-base text-muted-foreground md:text-lg">
            Sem cadastro, sem download de app. Funciona no navegador do seu
            celular.
          </p>
        </div>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="relative rounded-2xl border border-border bg-surface p-6 shadow-[var(--shadow-soft)]"
            >
              <span className="absolute -top-3 left-6 grid h-7 w-7 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm">
                {index + 1}
              </span>
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary-100 text-primary-700">
                <step.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
