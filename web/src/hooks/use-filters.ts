import { useState, useMemo, useCallback } from "react";
import type { Avaliacao, Filters, SortState } from "../types";

const DEFAULT_FILTERS: Filters = {
  uf: null,
  rede: null,
  faixa: null,
  scoreMin: 0,
  scoreMax: 5,
};

const DEFAULT_SORT: SortState = {
  field: "posicao",
  direction: "asc",
};

export function useFilters(avaliacoes: Avaliacao[]) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortState>(DEFAULT_SORT);

  const updateFilter = useCallback(
    <K extends keyof Filters>(key: K, value: Filters[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const toggleSort = useCallback((field: SortState["field"]) => {
    setSort((prev) => {
      if (prev.field === field) {
        return {
          field,
          direction: prev.direction === "asc" ? "desc" : "asc",
        };
      }
      return { field, direction: "asc" };
    });
  }, []);

  const filtered = useMemo(() => {
    let result = avaliacoes;

    if (filters.uf) {
      result = result.filter((a) => a.uf === filters.uf);
    }
    if (filters.rede) {
      result = result.filter((a) => a.rede === filters.rede);
    }
    if (filters.faixa !== null) {
      result = result.filter((a) => a.conceito_enade === filters.faixa);
    }
    result = result.filter(
      (a) =>
        a.enade_continuo >= filters.scoreMin &&
        a.enade_continuo <= filters.scoreMax,
    );

    result = [...result].sort((a, b) => {
      const aVal = a[sort.field];
      const bVal = b[sort.field];
      const cmp = typeof aVal === "number" ? (aVal as number) - (bVal as number) : String(aVal).localeCompare(String(bVal));
      return sort.direction === "asc" ? cmp : -cmp;
    });

    return result;
  }, [avaliacoes, filters, sort]);

  const uniqueUFs = useMemo(
    () => [...new Set(avaliacoes.map((a) => a.uf))].sort(),
    [avaliacoes],
  );

  return {
    filters,
    sort,
    filtered,
    uniqueUFs,
    updateFilter,
    clearFilters,
    toggleSort,
  };
}
