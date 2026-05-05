"use client";

import {
  ChangeEvent,
  DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Upload,
  Shirt,
  User,
  Wand2,
  X,
  AlertCircle,
  Download,
  RefreshCw,
  RotateCcw,
  Sparkles,
} from "lucide-react";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPTED_TYPES_LABEL = "JPG, PNG ou WEBP";
const MAX_SIZE_BYTES = 10 * 1024 * 1024;

const LOADING_MESSAGES = [
  "Analisando a peça...",
  "Ajustando o caimento...",
  "Renderizando resultado...",
];

type Slot = "garment" | "person";
type Phase = "idle" | "generating" | "result";

type UploadState = {
  file: File | null;
  previewUrl: string | null;
  error: string | null;
};

const INITIAL_STATE: UploadState = {
  file: null,
  previewUrl: null,
  error: null,
};

function validate(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `Formato não aceito. Envie ${ACCEPTED_TYPES_LABEL}.`;
  }
  if (file.size > MAX_SIZE_BYTES) {
    return "Arquivo muito grande. Tamanho máximo 10MB.";
  }
  return null;
}

export function TryOn() {
  const [garment, setGarment] = useState<UploadState>(INITIAL_STATE);
  const [person, setPerson] = useState<UploadState>(INITIAL_STATE);
  const [phase, setPhase] = useState<Phase>("idle");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loadingIndex, setLoadingIndex] = useState(0);

  const isReady = Boolean(garment.file && person.file);

  useEffect(() => {
    return () => {
      if (garment.previewUrl) URL.revokeObjectURL(garment.previewUrl);
      if (person.previewUrl) URL.revokeObjectURL(person.previewUrl);
    };
  }, [garment.previewUrl, person.previewUrl]);

  useEffect(() => {
    if (phase !== "generating") return;
    setLoadingIndex(0);
    const interval = setInterval(() => {
      setLoadingIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [phase]);

  const updateSlot = (slot: Slot, next: UploadState) => {
    const setter = slot === "garment" ? setGarment : setPerson;
    setter((prev) => {
      if (prev.previewUrl && prev.previewUrl !== next.previewUrl) {
        URL.revokeObjectURL(prev.previewUrl);
      }
      return next;
    });
  };

  const handleFile = (slot: Slot, file: File) => {
    const error = validate(file);
    if (error) {
      updateSlot(slot, { file: null, previewUrl: null, error });
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    updateSlot(slot, { file, previewUrl, error: null });
    setSubmitError(null);
  };

  const handleRemove = (slot: Slot) => {
    updateSlot(slot, INITIAL_STATE);
  };

  async function runGeneration() {
    if (!garment.file || !person.file) return;
    setPhase("generating");
    setSubmitError(null);

    const formData = new FormData();
    formData.append("garment", garment.file);
    formData.append("person", person.file);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });
      const json = (await response.json()) as
        | { image: string; mimeType: string }
        | { error: string };

      if (!response.ok || "error" in json) {
        const message =
          "error" in json
            ? json.error
            : "Não conseguimos gerar a imagem agora. Tente de novo.";
        setSubmitError(message);
        setPhase("idle");
        return;
      }

      setResultImage(json.image);
      setPhase("result");
    } catch (err) {
      console.error(err);
      setSubmitError(
        "Falha de conexão. Verifique sua internet e tente novamente.",
      );
      setPhase("idle");
    }
  }

  function resetAll() {
    if (garment.previewUrl) URL.revokeObjectURL(garment.previewUrl);
    if (person.previewUrl) URL.revokeObjectURL(person.previewUrl);
    setGarment(INITIAL_STATE);
    setPerson(INITIAL_STATE);
    setResultImage(null);
    setSubmitError(null);
    setPhase("idle");
  }

  function downloadResult() {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    const extension = resultImage.includes("image/jpeg") ? "jpg" : "png";
    link.download = `eufico-bem-${Date.now()}.${extension}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <section
      id="experimentar"
      className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20 scroll-mt-20"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {phase === "result"
            ? "Pronto! Aqui está você com essa peça."
            : "Faça a prova virtual"}
        </h2>
        <p className="mt-3 text-base text-muted-foreground md:text-lg">
          {phase === "result"
            ? "Pode baixar, gerar uma nova variação ou começar de novo."
            : "Envie as duas fotos abaixo e a gente devolve o resultado em segundos."}
        </p>
      </div>

      {phase === "result" && resultImage ? (
        <ResultView
          image={resultImage}
          onDownload={downloadResult}
          onVariation={runGeneration}
          onReset={resetAll}
        />
      ) : phase === "generating" ? (
        <GeneratingView message={LOADING_MESSAGES[loadingIndex]} />
      ) : (
        <UploadView
          garment={garment}
          person={person}
          isReady={isReady}
          submitError={submitError}
          onFile={handleFile}
          onRemove={handleRemove}
          onSubmit={runGeneration}
        />
      )}
    </section>
  );
}

type UploadViewProps = {
  garment: UploadState;
  person: UploadState;
  isReady: boolean;
  submitError: string | null;
  onFile: (slot: Slot, file: File) => void;
  onRemove: (slot: Slot) => void;
  onSubmit: () => void;
};

function UploadView({
  garment,
  person,
  isReady,
  submitError,
  onFile,
  onRemove,
  onSubmit,
}: UploadViewProps) {
  return (
    <>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <UploadCard
          step="1"
          slot="garment"
          title="A peça de roupa"
          hint="Foto do produto, de preferência em fundo claro."
          icon={<Shirt className="h-5 w-5" />}
          state={garment}
          onFile={(file) => onFile("garment", file)}
          onRemove={() => onRemove("garment")}
        />
        <UploadCard
          step="2"
          slot="person"
          title="Sua foto"
          hint="Corpo inteiro, de frente, com boa iluminação."
          icon={<User className="h-5 w-5" />}
          state={person}
          onFile={(file) => onFile("person", file)}
          onRemove={() => onRemove("person")}
        />
      </div>

      {submitError ? (
        <div className="mt-6 mx-auto max-w-xl flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-sm text-red-700 animate-fade-in">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{submitError}</span>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col items-center gap-3">
        <button
          type="button"
          disabled={!isReady}
          onClick={onSubmit}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary-600 disabled:bg-primary-200 disabled:text-primary-700 disabled:cursor-not-allowed transition-colors"
        >
          <Wand2 className="h-4 w-4" />
          {submitError ? "Tentar novamente" : "Gerar prova virtual"}
        </button>
        <p className="text-xs text-muted-foreground">
          {isReady
            ? "Pronto! Clique para gerar."
            : "Envie as duas fotos para liberar o botão"}
        </p>
      </div>
    </>
  );
}

function GeneratingView({ message }: { message: string }) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-6 rounded-3xl border border-border bg-surface px-6 py-16 shadow-[var(--shadow-soft)] animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 animate-ping rounded-full bg-primary-200 opacity-70" />
        <div className="relative grid h-16 w-16 place-items-center rounded-full bg-primary text-primary-foreground shadow-md">
          <Sparkles className="h-7 w-7" />
        </div>
      </div>
      <div className="text-center">
        <p
          key={message}
          className="text-lg font-medium text-foreground animate-fade-in"
        >
          {message}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Isso costuma levar alguns segundos.
        </p>
      </div>
      <div className="flex gap-1.5">
        {LOADING_MESSAGES.map((m) => (
          <span
            key={m}
            className={`h-1.5 w-6 rounded-full transition-colors ${
              m === message ? "bg-primary" : "bg-primary-100"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

type ResultViewProps = {
  image: string;
  onDownload: () => void;
  onVariation: () => void;
  onReset: () => void;
};

function ResultView({
  image,
  onDownload,
  onVariation,
  onReset,
}: ResultViewProps) {
  return (
    <div className="mt-10 flex flex-col items-center gap-6 animate-fade-up">
      <div className="w-full max-w-md">
        <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-[var(--shadow-soft)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Resultado: você vestindo a peça"
            className="h-auto w-full object-contain animate-fade-in"
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onDownload}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary-600 transition-colors"
        >
          <Download className="h-4 w-4" />
          Baixar imagem
        </button>
        <button
          type="button"
          onClick={onVariation}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3 text-sm font-medium text-foreground hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Gerar nova variação
        </button>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Começar de novo
        </button>
      </div>

      <p className="max-w-md text-center text-xs text-muted-foreground">
        Resultado gerado por IA. Pode haver pequenas variações em relação ao
        produto real.
      </p>
    </div>
  );
}

type UploadCardProps = {
  step: string;
  slot: Slot;
  title: string;
  hint: string;
  icon: React.ReactNode;
  state: UploadState;
  onFile: (file: File) => void;
  onRemove: () => void;
};

function UploadCard({
  step,
  slot,
  title,
  hint,
  icon,
  state,
  onFile,
  onRemove,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openFilePicker = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFile(file);
    event.target.value = "";
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) onFile(file);
  };

  const inputId = `upload-${slot}`;
  const hasFile = Boolean(state.file && state.previewUrl);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-[var(--shadow-soft)]">
      <div className="flex items-center gap-3">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-100 text-sm font-semibold text-primary-700">
          {step}
        </span>
        <div className="flex items-center gap-2 text-foreground">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
      </div>

      <input
        ref={inputRef}
        id={inputId}
        type="file"
        accept={ACCEPTED_TYPES.join(",")}
        className="sr-only"
        onChange={handleInputChange}
      />

      {hasFile ? (
        <div className="mt-4 relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={state.previewUrl!}
            alt={title}
            className="h-full w-full object-cover animate-fade-in"
          />
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Remover ${title}`}
            className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-surface/95 text-foreground shadow-md hover:bg-surface transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={openFilePicker}
            className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-surface/95 px-3 py-1.5 text-xs font-medium text-foreground shadow-md hover:bg-surface transition-colors"
          >
            Trocar imagem
          </button>
        </div>
      ) : (
        <label
          htmlFor={inputId}
          onDragOver={handleDragOver}
          onDragEnter={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-4 flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
            isDragging
              ? "border-primary bg-primary-50"
              : "border-border bg-muted/60 hover:border-primary-300 hover:bg-primary-50/70"
          }`}
        >
          <span className="grid h-12 w-12 place-items-center rounded-full bg-surface text-primary-600 shadow-sm">
            <Upload className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">
              Arraste a imagem aqui
            </p>
            <p className="text-xs text-muted-foreground">
              ou clique para selecionar
            </p>
          </div>
        </label>
      )}

      {state.error ? (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      ) : (
        <p className="mt-3 text-xs text-muted-foreground">
          {hint}
          <span className="ml-1 text-muted-foreground/70">
            {ACCEPTED_TYPES_LABEL}, até 10MB.
          </span>
        </p>
      )}
    </div>
  );
}
