const FAIXA_COLORS: Record<number, string> = {
  5: "bg-success/20 text-success",
  4: "bg-primary/20 text-primary",
  3: "bg-warning/20 text-warning",
  2: "bg-error/20 text-error",
  1: "bg-error/20 text-error",
};

interface FaixaBadgeProps {
  value: number;
}

export function FaixaBadge({ value }: FaixaBadgeProps) {
  const colors = FAIXA_COLORS[value] ?? "bg-text-muted/20 text-text-muted";

  return (
    <span
      className={`inline-flex items-center justify-center w-6 h-6 rounded-[var(--ds-radius-md)] text-[11px] font-bold ds-mono ${colors}`}
    >
      {value}
    </span>
  );
}
