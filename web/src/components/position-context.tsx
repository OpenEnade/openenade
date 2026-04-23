import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { Avaliacao } from "../types";
import { InfoTip } from "./info-tip";

interface PositionContextProps {
  a: Avaliacao;
  b: Avaliacao;
  allAvaliacoes: Avaliacao[];
}

function PositionCard({
  avaliacao,
  total,
  avg,
}: {
  avaliacao: Avaliacao;
  total: number;
  avg: number;
}) {
  const { t } = useTranslation();

  const pct = Math.max(1, Math.round((avaliacao.posicao / total) * 100));
  const diff = avaliacao.enade_continuo - avg;
  const absDiff = Math.abs(diff).toFixed(2);
  const avgStr = avg.toFixed(2);

  // Position marker on 0-5 scale
  const markerPct = Math.min((avaliacao.enade_continuo / 5) * 100, 100);
  const avgMarkerPct = Math.min((avg / 5) * 100, 100);

  let diffLabel: string;
  if (Math.abs(diff) < 0.005) {
    diffLabel = t("compare.at_avg", { avg: avgStr });
  } else if (diff > 0) {
    diffLabel = t("compare.above_avg", { diff: absDiff, avg: avgStr });
  } else {
    diffLabel = t("compare.below_avg", { diff: absDiff, avg: avgStr });
  }

  const diffColor =
    Math.abs(diff) < 0.005
      ? "text-text-muted"
      : diff > 0
        ? "text-success"
        : "text-error";

  return (
    <div className="flex-1 min-w-0">
      <div className="text-[11px] font-semibold ds-mono truncate mb-1.5">
        {avaliacao.ies}
      </div>
      <div className="text-primary text-[11px] font-semibold ds-mono mb-0.5">
        {t("compare.top_pct", { pct })}
      </div>
      <div className={`text-[10px] ds-mono mb-2 ${diffColor}`}>
        {diffLabel}
      </div>

      {/* Position bar */}
      <div className="relative h-1.5 rounded-[var(--ds-radius-sm)] bg-border/40">
        {/* Average marker */}
        <div
          className="absolute top-[-2px] w-[1px] h-[11px] bg-text-muted/50"
          style={{ left: `${avgMarkerPct}%` }}
        />
        {/* Score marker */}
        <div
          className="absolute top-[-1.5px] w-2 h-2 rounded-full bg-primary"
          style={{ left: `calc(${markerPct}% - 4px)` }}
        />
      </div>
      <div className="flex justify-between text-[8px] text-text-muted ds-mono mt-0.5">
        <span>0</span>
        <span>{t("compare.national_avg")}</span>
        <span>5</span>
      </div>
    </div>
  );
}

export function PositionContext({ a, b, allAvaliacoes }: PositionContextProps) {
  const { t } = useTranslation();

  const { avg, total } = useMemo(() => {
    const scores = allAvaliacoes.map((av) => av.enade_continuo);
    const sum = scores.reduce((s, v) => s + v, 0);
    return {
      avg: scores.length > 0 ? sum / scores.length : 0,
      total: scores.length,
    };
  }, [allAvaliacoes]);

  return (
    <div className="p-3 sm:p-4 border-b border-border">
      <h4 className="text-[10px] sm:text-[11px] text-text-muted uppercase tracking-wider mb-3 ds-mono">
        {t("compare.position_context")}<InfoTip text={t("compare.tip_position_context")} />
      </h4>
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <PositionCard avaliacao={a} total={total} avg={avg} />
        <PositionCard avaliacao={b} total={total} avg={avg} />
      </div>
    </div>
  );
}
