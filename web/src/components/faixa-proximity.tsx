import { useTranslation } from "react-i18next";
import type { Avaliacao } from "../types";
import { InfoTip } from "./info-tip";

interface FaixaProximityProps {
  a: Avaliacao;
  b: Avaliacao;
}

const FAIXA_BOUNDS: { lower: number; upper: number }[] = [
  { lower: 0, upper: 0.944 },      // faixa 1
  { lower: 0.945, upper: 1.944 },   // faixa 2
  { lower: 1.945, upper: 2.944 },   // faixa 3
  { lower: 2.945, upper: 3.944 },   // faixa 4
  { lower: 3.945, upper: 5.0 },     // faixa 5
];

function getBounds(faixa: number) {
  return FAIXA_BOUNDS[faixa - 1] ?? FAIXA_BOUNDS[0];
}

function ProximityCard({ avaliacao }: { avaliacao: Avaliacao }) {
  const { t } = useTranslation();
  const faixa = avaliacao.conceito_enade;
  const score = avaliacao.enade_continuo;
  const bounds = getBounds(faixa);

  const distToUpper = bounds.upper - score;
  const distFromLower = score - bounds.lower;
  const bandWidth = bounds.upper - bounds.lower;
  const progressPct = bandWidth > 0 ? ((score - bounds.lower) / bandWidth) * 100 : 100;

  const isMaxFaixa = faixa === 5;

  return (
    <div className="flex-1 min-w-0">
      <div className="text-[11px] font-semibold ds-mono truncate mb-1.5">
        {avaliacao.ies}
      </div>

      {/* Progress within faixa */}
      <div className="relative h-2 rounded-[var(--ds-radius-sm)] bg-border/40 mb-1.5">
        <div
          className="h-full rounded-[var(--ds-radius-sm)] bg-primary/60"
          style={{ width: `${Math.min(progressPct, 100)}%` }}
        />
      </div>

      <div className="space-y-0.5">
        {!isMaxFaixa ? (
          <div className="text-[10px] ds-mono text-success">
            {t("compare.faixa_to_next", {
              diff: distToUpper.toFixed(2),
              next: faixa + 1,
            })}
          </div>
        ) : (
          <div className="text-[10px] ds-mono text-primary">
            {t("compare.faixa_at_max")}
          </div>
        )}
        {faixa > 1 && (
          <div className="text-[10px] ds-mono text-text-muted">
            {t("compare.faixa_above_lower", {
              diff: distFromLower.toFixed(2),
              lower: faixa - 1,
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function FaixaProximity({ a, b }: FaixaProximityProps) {
  const { t } = useTranslation();

  return (
    <div className="p-3 sm:p-4 border-b border-border">
      <h4 className="text-[10px] sm:text-[11px] text-text-muted uppercase tracking-wider mb-3 ds-mono">
        {t("compare.faixa_proximity")}<InfoTip text={t("compare.tip_faixa_proximity")} />
      </h4>
      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        <ProximityCard avaliacao={a} />
        <ProximityCard avaliacao={b} />
      </div>
    </div>
  );
}
