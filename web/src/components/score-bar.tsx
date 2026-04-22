interface ScoreBarProps {
  value: number;
  max?: number;
}

function scoreColor(value: number): string {
  if (value >= 3.945) return "bg-success";
  if (value >= 1.945) return "bg-primary";
  return "bg-error";
}

function scoreTextColor(value: number): string {
  if (value >= 3.945) return "text-success";
  if (value >= 1.945) return "text-primary";
  return "text-error";
}

export function ScoreBar({ value, max = 5 }: ScoreBarProps) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-block w-20 h-1.5 rounded-[var(--ds-radius-sm)] bg-surface-alt overflow-hidden">
        <span
          className={`block h-full rounded-[var(--ds-radius-sm)] ${scoreColor(value)}`}
          style={{ width: `${pct}%` }}
        />
      </span>
      <span className={`ds-mono text-xs font-semibold ${scoreTextColor(value)}`}>
        {value.toFixed(4)}
      </span>
    </span>
  );
}
