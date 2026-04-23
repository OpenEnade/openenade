import { useTranslation } from "react-i18next";
import type { Avaliacao } from "../types";
import { InfoTip } from "./info-tip";

interface TrapCalloutProps {
  a: Avaliacao;
  b: Avaliacao;
}

// Lower bounds for each faixa
const FAIXA_LOWER: Record<number, number> = {
  1: 0,
  2: 0.945,
  3: 1.945,
  4: 2.945,
  5: 3.945,
};

export function TrapCallout({ a, b }: TrapCalloutProps) {
  const { t } = useTranslation();

  // Only show when both have same faixa but scores differ significantly
  if (a.conceito_enade !== b.conceito_enade) return null;

  const diff = Math.abs(a.enade_continuo - b.enade_continuo);
  if (diff < 0.5) return null;

  const lower = a.enade_continuo < b.enade_continuo ? a : b;
  const higher = a.enade_continuo >= b.enade_continuo ? a : b;
  const lowerBound = FAIXA_LOWER[lower.conceito_enade] ?? 0;
  const diffFromLower = (lower.enade_continuo - lowerBound).toFixed(2);

  return (
    <div className="p-3 sm:p-4 border-b border-border">
      <div className="border-l-2 border-l-warning px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] leading-relaxed">
        <div className="text-warning font-semibold text-[10px] uppercase tracking-wider mb-1 ds-mono">
          {t("compare.trap_title")}<InfoTip text={t("compare.tip_trap")} />
        </div>
        <div className="text-text-muted">
          {t("compare.trap_body", {
            ies_a: higher.ies,
            ies_b: lower.ies,
            faixa: lower.conceito_enade,
            score_a: higher.enade_continuo.toFixed(4),
            score_b: lower.enade_continuo.toFixed(4),
            diff: diff.toFixed(2),
            diff_low: diffFromLower,
          })}
        </div>
      </div>
    </div>
  );
}
