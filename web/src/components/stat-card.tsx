interface StatCardProps {
  value: string | number;
  label: string;
}

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center px-2 sm:px-3 py-2">
      <div className="text-base sm:text-xl font-bold text-primary ds-mono">{value}</div>
      <div className="text-[8px] sm:text-[10px] text-text-muted uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
}
