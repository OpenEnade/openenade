import { useTranslation } from "react-i18next";
import type { Avaliacao } from "../types";

interface SampleSizeCalloutProps {
  a: Avaliacao;
  b: Avaliacao;
}

const SMALL_THRESHOLD = 30;
const LARGE_RATIO = 5;

export function SampleSizeCallout({ a, b }: SampleSizeCalloutProps) {
  const { t } = useTranslation();

  const nA = a.concluintes_participantes ?? 0;
  const nB = b.concluintes_participantes ?? 0;

  if (nA === 0 || nB === 0) return null;

  const bothSmall = nA < SMALL_THRESHOLD && nB < SMALL_THRESHOLD;
  const ratio = nA > nB ? nA / nB : nB / nA;
  const largeDiff = ratio >= LARGE_RATIO;

  if (!bothSmall && !largeDiff) return null;

  let message: string;

  if (bothSmall) {
    message = t("compare.sample_both_small", { threshold: SMALL_THRESHOLD });
  } else {
    const [large, small] = nA > nB ? [a, b] : [b, a];
    const [nLarge, nSmall] = nA > nB ? [nA, nB] : [nB, nA];
    message = t("compare.sample_large_diff", {
      ies_large: large.ies,
      n_large: nLarge,
      n_small: nSmall,
      ies_small: small.ies,
    });
  }

  return (
    <div className="p-3 sm:p-4 border-b border-border">
      <div className="border-l-2 border-l-text-muted px-2.5 sm:px-3.5 py-2 sm:py-2.5 text-[10px] sm:text-[11px] leading-relaxed">
        <div className="text-text-muted font-semibold text-[10px] uppercase tracking-wider mb-1 ds-mono">
          {t("compare.sample_title")}
        </div>
        <div className="text-text-muted">{message}</div>
      </div>
    </div>
  );
}
