import { useTranslation } from "react-i18next";
import type { Avaliacao } from "../types";
import { FaixaBadge } from "./faixa-badge";

interface CompareCardsProps {
  a: Avaliacao;
  b: Avaliacao;
}

function scoreColor(value: number): string {
  if (value >= 3.945) return "text-success";
  if (value >= 1.945) return "text-primary";
  return "text-error";
}

function Card({
  avaliacao,
  isWinner,
}: {
  avaliacao: Avaliacao;
  isWinner: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div
      className={`ds-panel p-3 sm:p-4 ${isWinner ? "border-t-2 border-t-primary" : ""}`}
    >
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1 ds-mono">
        {t("compare.national_rank", { position: avaliacao.posicao })}
      </div>
      <div className="text-[15px] font-bold mb-0.5">{avaliacao.ies}</div>
      <div className="text-[10px] text-text-muted mb-3">
        {avaliacao.ies_nome}
      </div>
      <div className={`text-xl sm:text-[28px] font-bold ds-mono mb-0.5 ${scoreColor(avaliacao.enade_continuo)}`}>
        {avaliacao.enade_continuo.toFixed(4)}
      </div>
      <div className="text-[10px] text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
        {t("compare.score_label")} <FaixaBadge value={avaliacao.conceito_enade} />
      </div>
      <div className="text-[10px] text-text-muted leading-relaxed ds-mono space-y-0.5 sm:space-y-0">
        <div>
          UF: <span className="text-text">{avaliacao.uf}</span> | Municipio:{" "}
          <span className="text-text">{avaliacao.municipio}</span>
        </div>
        <div>
          Rede: <span className="text-text">{avaliacao.rede}</span> |
          Modalidade: <span className="text-text">{avaliacao.modalidade}</span>
        </div>
        <div>
          {t("compare.participants")}:{" "}
          <span className="text-text">
            {avaliacao.concluintes_participantes ?? "--"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CompareCards({ a, b }: CompareCardsProps) {
  const { t } = useTranslation();
  const aWins = a.enade_continuo >= b.enade_continuo;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-2 sm:gap-0 p-3 sm:p-4 border-b border-border">
      <Card avaliacao={a} isWinner={aWins} />
      <div className="flex items-center justify-center py-1 sm:py-0 sm:px-3 text-text-muted font-bold text-sm">
        {t("compare.vs")}
      </div>
      <Card avaliacao={b} isWinner={!aWins} />
    </div>
  );
}
