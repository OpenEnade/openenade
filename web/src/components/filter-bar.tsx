import { useTranslation } from "react-i18next";
import type { Filters } from "../types";

interface FilterBarProps {
  filters: Filters;
  uniqueUFs: string[];
  resultCount: number;
  onUpdate: <K extends keyof Filters>(key: K, value: Filters[K]) => void;
  onClear: () => void;
}

export function FilterBar({
  filters,
  uniqueUFs,
  resultCount,
  onUpdate,
  onClear,
}: FilterBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap px-2 sm:px-4 py-2 sm:py-3 border-b border-border ds-mono text-[10px] sm:text-xs">
      <span className="text-text-muted text-[10px] uppercase tracking-wider mr-1">
        {t("home.filters.label")}:
      </span>

      <select
        value={filters.uf ?? ""}
        onChange={(e) => onUpdate("uf", e.target.value || null)}
        className="border border-border rounded-[var(--ds-radius-md)] px-2 py-1 bg-transparent text-text"
      >
        <option value="">{t("home.filters.uf")}</option>
        {uniqueUFs.map((uf) => (
          <option key={uf} value={uf}>
            {uf}
          </option>
        ))}
      </select>

      <select
        value={filters.rede ?? ""}
        onChange={(e) => onUpdate("rede", e.target.value || null)}
        className="border border-border rounded-[var(--ds-radius-md)] px-2 py-1 bg-transparent text-text"
      >
        <option value="">{t("home.filters.rede")}</option>
        <option value="PUBLICA">PUB</option>
        <option value="PRIVADA">PRIV</option>
      </select>

      <select
        value={filters.faixa ?? ""}
        onChange={(e) =>
          onUpdate("faixa", e.target.value ? Number(e.target.value) : null)
        }
        className="border border-border rounded-[var(--ds-radius-md)] px-2 py-1 bg-transparent text-text"
      >
        <option value="">{t("home.filters.faixa")}</option>
        {[5, 4, 3, 2, 1].map((f) => (
          <option key={f} value={f}>
            {f}
          </option>
        ))}
      </select>

      <button
        onClick={onClear}
        className="text-text-muted hover:text-primary transition-colors duration-[var(--ds-transition-fast)] cursor-pointer"
      >
        {t("home.filters.clear")}
      </button>

      <span className="flex-1" />
      <span className="text-text-muted text-[10px]">
        {resultCount} {t("home.filters.results")}
      </span>
    </div>
  );
}
