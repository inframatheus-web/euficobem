type LogoProps = {
  className?: string;
};

export function Logo({ className }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground font-semibold text-sm shadow-sm"
      >
        e
      </span>
      <span className="font-semibold tracking-tight text-foreground">
        EuFicoBem
      </span>
    </div>
  );
}
