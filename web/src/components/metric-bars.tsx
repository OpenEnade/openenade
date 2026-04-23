import { useTranslation } from "react-i18next";
import { InfoTip } from "./info-tip";

interface Metric {
  label: string;
  valueA: number;
  valueB: number;
  max: number;
  tooltip?: string;
}

interface MetricBarsProps {
  metrics: Metric[];
}

export function MetricBars({ metrics }: MetricBarsProps) {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 border-b border-border">
      <h4 className="text-[10px] sm:text-[11px] text-text-muted uppercase tracking-wider mb-3 ds-mono text-center">
        {t("compare.metrics")}<InfoTip text={t("compare.tip_metrics")} />
      </h4>
      <div className="space-y-2 sm:space-y-2">
        {metrics.map((m) => {
          const pctA = Math.min((m.valueA / m.max) * 100, 100);
          const pctB = Math.min((m.valueB / m.max) * 100, 100);
          const aWins = m.valueA >= m.valueB;

          return (
            <div
              key={m.label}
              className="grid grid-cols-[40px_1fr_24px_1fr_40px] sm:grid-cols-[60px_1fr_30px_1fr_60px] items-center gap-1 sm:gap-1.5 ds-mono text-[10px] sm:text-[11px]"
            >
              <div
                className={`text-right font-semibold ${aWins ? "text-success" : "text-text-muted"}`}
              >
                {m.valueA.toFixed(2)}
              </div>
              <div className="h-2 rounded-[var(--ds-radius-sm)] bg-border/40 overflow-hidden flex justify-end">
                <div
                  className={`h-full rounded-[var(--ds-radius-sm)] ${aWins ? "bg-success" : "bg-text-muted"}`}
                  style={{ width: `${pctA}%` }}
                />
              </div>
              <div className="text-center text-[10px] text-text-muted uppercase">
                {m.label}{m.tooltip && <InfoTip text={m.tooltip} />}
              </div>
              <div className="h-2 rounded-[var(--ds-radius-sm)] bg-border/40 overflow-hidden">
                <div
                  className={`h-full rounded-[var(--ds-radius-sm)] ${!aWins ? "bg-success" : "bg-text-muted"}`}
                  style={{ width: `${pctB}%` }}
                />
              </div>
              <div
                className={`text-left font-semibold ${!aWins ? "text-success" : "text-text-muted"}`}
              >
                {m.valueB.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
