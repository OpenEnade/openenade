import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import type { Avaliacao, SortState } from "../types";
import { ScoreBar } from "./score-bar";
import { FaixaBadge } from "./faixa-badge";
import { RedeBadge } from "./rede-badge";

interface RankingTableProps {
  avaliacoes: Avaliacao[];
  curso: string;
  ano: number;
  sort: SortState;
  onToggleSort: (field: SortState["field"]) => void;
}

function InfoTip({ text }: { text: string }) {
  return (
    <span className="relative group ml-0.5 inline-flex">
      <span className="text-text-muted hover:text-primary cursor-help text-[8px] align-super">i</span>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1.5 rounded-[var(--ds-radius-md)] bg-surface border border-border text-[10px] text-text-muted leading-snug w-48 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-[var(--ds-transition-fast)] z-20 ds-mono">
        {text}
      </span>
    </span>
  );
}

function SortHeader({
  field,
  label,
  sort,
  onToggle,
  className = "",
  tooltip,
}: {
  field: SortState["field"];
  label: string;
  sort: SortState;
  onToggle: (f: SortState["field"]) => void;
  className?: string;
  tooltip?: string;
}) {
  const isActive = sort.field === field;
  const arrow = isActive ? (sort.direction === "asc" ? " ▲" : " ▼") : "";

  return (
    <th
      onClick={() => onToggle(field)}
      className={`cursor-pointer hover:text-primary transition-colors duration-[var(--ds-transition-fast)] select-none ${className}`}
    >
      {label}
      {tooltip && <InfoTip text={tooltip} />}
      {arrow}
    </th>
  );
}

export function RankingTable({
  avaliacoes,
  curso,
  ano,
  sort,
  onToggleSort,
}: RankingTableProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number[]>([]);

  function toggleSelect(posicao: number) {
    setSelected((prev) => {
      if (prev.includes(posicao)) {
        return prev.filter((p) => p !== posicao);
      }
      if (prev.length >= 2) {
        return [prev[1], posicao];
      }
      return [...prev, posicao];
    });
  }

  function handleCompare() {
    if (selected.length !== 2) return;
    const slug = curso.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    navigate(`/comparar?a=${selected[0]}&b=${selected[1]}&curso=${slug}&ano=${ano}`);
  }

  const selectedNames = selected.map((pos) => {
    const a = avaliacoes.find((av) => av.posicao === pos);
    return a?.ies ?? `#${pos}`;
  });

  return (
    <div className="relative">
      <div className="overflow-x-auto ds-custom-scrollbar">
        <table className="w-full text-[10px] sm:text-[11px] ds-mono">
          <thead>
            <tr className="text-left text-text-muted text-[9px] sm:text-[10px] uppercase tracking-wider border-b border-border">
              <th className="px-1.5 sm:px-2.5 py-2 w-6 sm:w-8" />
              <SortHeader field="posicao" label={t("table.position")} sort={sort} onToggle={onToggleSort} />
              <SortHeader field="ies" label={t("table.ies")} sort={sort} onToggle={onToggleSort} />
              <SortHeader field="uf" label={t("table.uf")} sort={sort} onToggle={onToggleSort} className="hidden sm:table-cell" />
              <th className="hidden md:table-cell">{t("table.rede")}</th>
              <SortHeader field="enade_continuo" label={t("table.score")} sort={sort} onToggle={onToggleSort} tooltip={t("table.score_tip")} />
              <SortHeader field="conceito_enade" label={t("table.faixa")} sort={sort} onToggle={onToggleSort} tooltip={t("table.faixa_tip")} />
              <SortHeader field="nota_fg" label={t("table.fg")} sort={sort} onToggle={onToggleSort} className="hidden lg:table-cell" tooltip={t("table.fg_tip")} />
              <SortHeader field="nota_ce" label={t("table.ce")} sort={sort} onToggle={onToggleSort} className="hidden lg:table-cell" tooltip={t("table.ce_tip")} />
            </tr>
          </thead>
          <tbody>
            {avaliacoes.map((a) => {
              const isSelected = selected.includes(a.posicao);
              return (
                <tr
                  key={`${a.posicao}-${a.ies}`}
                  onClick={() => toggleSelect(a.posicao)}
                  className={`ds-row-hover cursor-pointer border-b border-border ${isSelected ? "bg-primary/10" : ""}`}
                >
                  <td className="px-1.5 sm:px-2.5 py-1.5 sm:py-2 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-4 h-4 rounded-[var(--ds-radius-sm)] border text-[9px] ${
                        isSelected
                          ? "border-primary bg-primary text-background font-bold"
                          : "border-border text-transparent"
                      }`}
                    >
                      {isSelected ? (selected.indexOf(a.posicao) === 0 ? "A" : "B") : "."}
                    </span>
                  </td>
                  <td className="px-1.5 sm:px-2.5 py-1.5 sm:py-2 text-text-muted">{a.posicao}</td>
                  <td className="px-1.5 sm:px-2.5 py-1.5 sm:py-2">
                    <div className="font-semibold text-[10px] sm:text-[11px]">{a.ies}</div>
                    <div className="text-[9px] sm:text-[10px] text-text-muted truncate max-w-[120px] sm:max-w-none">{a.municipio}</div>
                  </td>
                  <td className="hidden sm:table-cell px-2.5 py-2">{a.uf}</td>
                  <td className="hidden md:table-cell px-2.5 py-2">
                    <RedeBadge value={a.rede} />
                  </td>
                  <td className="px-1.5 sm:px-2.5 py-1.5 sm:py-2">
                    <ScoreBar value={a.enade_continuo} />
                  </td>
                  <td className="px-1.5 sm:px-2.5 py-1.5 sm:py-2">
                    <FaixaBadge value={a.conceito_enade} />
                  </td>
                  <td className="hidden lg:table-cell px-2.5 py-2 text-text-muted">
                    {a.nota_fg?.toFixed(2) ?? "--"}
                  </td>
                  <td className="hidden lg:table-cell px-2.5 py-2 text-text-muted">
                    {a.nota_ce?.toFixed(2) ?? "--"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Compare floating bar */}
      {selected.length > 0 && (
        <div className="sticky bottom-0 left-0 right-0 border-t border-border bg-surface/95 backdrop-blur px-2 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between ds-mono text-[10px] sm:text-xs gap-2">
          <div className="text-text-muted min-w-0 truncate">
            {selected.length === 1 ? (
              <>
                <span className="text-primary font-semibold">{selectedNames[0]}</span>
                <span className="hidden sm:inline">{" | selecione mais uma IES para comparar"}</span>
                <span className="sm:hidden">{" | +1 IES"}</span>
              </>
            ) : (
              <>
                <span className="text-primary font-semibold">{selectedNames[0]}</span>
                {" vs "}
                <span className="text-primary font-semibold">{selectedNames[1]}</span>
              </>
            )}
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setSelected([])}
              className="text-text-muted hover:text-primary transition-colors cursor-pointer"
            >
              Limpar
            </button>
            <button
              onClick={handleCompare}
              disabled={selected.length !== 2}
              className={`px-2 sm:px-3 py-1 rounded-[var(--ds-radius-md)] font-semibold transition-colors cursor-pointer ${
                selected.length === 2
                  ? "bg-primary text-background hover:bg-primary/80"
                  : "bg-border text-text-muted cursor-not-allowed"
              }`}
            >
              Comparar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
