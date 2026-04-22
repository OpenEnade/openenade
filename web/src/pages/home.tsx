import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { NavBar } from "../components/nav-bar";
import { Footer } from "../components/footer";
import { StatCard } from "../components/stat-card";
import { FilterBar } from "../components/filter-bar";
import { RankingTable } from "../components/ranking-table";
import { useCourseData, useCourseIndex } from "../hooks/use-course-data";
import { useFilters } from "../hooks/use-filters";

interface CourseGroup {
  nome: string;
  latestSlug: string;
  latestYear: number;
  latestTotal: number;
  years: { ano: number; slug: string }[];
}

export function Home() {
  const { t } = useTranslation();
  const courseIndex = useCourseIndex();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const courseData = useCourseData(selectedSlug ?? "");

  const avaliacoes = selectedSlug && courseData ? courseData.avaliacoes : [];
  const {
    filters,
    sort,
    filtered,
    uniqueUFs,
    updateFilter,
    clearFilters,
    toggleSort,
  } = useFilters(avaliacoes);

  const stats = useMemo(() => {
    if (avaliacoes.length === 0) return null;
    const highest = Math.max(...avaliacoes.map((a) => a.enade_continuo));
    const faixa4 = avaliacoes.filter((a) => a.conceito_enade === 4);
    const belowThreshold = faixa4.filter((a) => a.enade_continuo < 3.2);
    const trapPct =
      faixa4.length > 0
        ? Math.round((belowThreshold.length / faixa4.length) * 100)
        : 0;
    return { total: avaliacoes.length, highest, trapPct };
  }, [avaliacoes]);

  // Group courses by name, pick latest year as default
  const courseGroups = useMemo(() => {
    const groups = new Map<string, CourseGroup>();
    for (const c of courseIndex) {
      const existing = groups.get(c.nome);
      if (!existing) {
        groups.set(c.nome, {
          nome: c.nome,
          latestSlug: c.slug,
          latestYear: c.ano,
          latestTotal: c.total,
          years: [{ ano: c.ano, slug: c.slug }],
        });
      } else {
        existing.years.push({ ano: c.ano, slug: c.slug });
        if (c.ano > existing.latestYear) {
          existing.latestYear = c.ano;
          existing.latestSlug = c.slug;
          existing.latestTotal = c.total;
        }
      }
    }
    return [...groups.values()].sort((a, b) => a.nome.localeCompare(b.nome));
  }, [courseIndex]);

  // Filter course grid by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return courseGroups;
    const q = searchQuery.toLowerCase();
    return courseGroups.filter((g) => g.nome.toLowerCase().includes(q));
  }, [courseGroups, searchQuery]);

  // Find available years for selected course
  const selectedGroup = useMemo(() => {
    if (!courseData) return null;
    return courseGroups.find((g) => g.nome === courseData.curso) ?? null;
  }, [courseData, courseGroups]);

  // Global stats
  const globalStats = useMemo(() => {
    if (courseGroups.length === 0) return null;
    const uniqueCourses = courseGroups.length;
    const totalRecords = courseIndex.reduce((sum, c) => sum + c.total, 0);
    const years = [...new Set(courseIndex.map((c) => c.ano))].sort();
    return { uniqueCourses, totalRecords, years };
  }, [courseGroups, courseIndex]);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavBar />

      <div className="ds-container flex-1">
        {/* Hero: project info */}
        <div className="text-center py-5 sm:py-8 border-b border-border">
          <h1 className="text-primary text-sm sm:text-base font-semibold mb-1 ds-mono">
            {t("home.title")}
          </h1>
          <p className="text-text-muted text-[10px] sm:text-xs mb-3 sm:mb-4">{t("home.subtitle")}</p>
          {globalStats && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--ds-radius-md)] border border-border text-[10px] text-text-muted ds-mono flex-wrap justify-center">
              <span className="text-primary font-semibold">ENADE {globalStats.years.join(", ")}</span>
              <span>|</span>
              <span>{globalStats.uniqueCourses} cursos</span>
              <span>|</span>
              <span>{globalStats.totalRecords.toLocaleString()} avaliacoes</span>
            </div>
          )}
        </div>

        {/* Course browser: search + grid */}
        {!selectedSlug && (
          <div className="py-4 sm:py-6">
            <div className="max-w-md mx-auto mb-4 sm:mb-6">
              <div className="flex items-center gap-2 border border-border rounded-[var(--ds-radius-md)] px-3 py-2 ds-mono text-sm focus-within:border-primary transition-colors duration-[var(--ds-transition-fast)]">
                <span className="text-primary font-semibold">&gt;</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("home.search_placeholder")}
                  className="flex-1 bg-transparent outline-none text-text placeholder:text-text-muted text-xs sm:text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="text-text-muted hover:text-primary text-xs cursor-pointer"
                  >
                    x
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
              {filteredGroups.map((g) => (
                <button
                  key={g.nome}
                  onClick={() => {
                    setSelectedSlug(g.latestSlug);
                    setSearchQuery("");
                  }}
                  className="ds-panel px-3 py-2.5 text-left ds-row-hover cursor-pointer transition-colors"
                >
                  <div className="text-[10px] sm:text-[11px] font-semibold ds-mono truncate">{g.nome}</div>
                  <div className="text-[9px] sm:text-[10px] text-text-muted ds-mono">
                    {g.latestTotal} IES | {g.latestYear}
                    {g.years.length > 1 && (
                      <span className="text-primary ml-1">+{g.years.length - 1} ano{g.years.length > 2 ? "s" : ""}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {filteredGroups.length === 0 && searchQuery && (
              <p className="text-center text-text-muted text-xs ds-mono py-8">
                Nenhum curso encontrado para "{searchQuery}"
              </p>
            )}
          </div>
        )}

        {/* Course view: header + stats + filters + table */}
        {selectedSlug && courseData && (
          <>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setSelectedSlug(null)}
                  className="text-text-muted hover:text-primary transition-colors ds-mono text-xs cursor-pointer"
                >
                  &lt;
                </button>
                <div>
                  <h2 className="text-sm sm:text-base font-semibold ds-mono">{courseData.curso}</h2>
                  <span className="text-[10px] text-text-muted ds-mono">ENADE {courseData.ano} | {courseData.total} IES avaliadas</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {selectedGroup && selectedGroup.years.length > 1 && (
                  selectedGroup.years
                    .sort((a, b) => b.ano - a.ano)
                    .map((y) => (
                      <button
                        key={y.ano}
                        onClick={() => setSelectedSlug(y.slug)}
                        className={`text-[10px] px-2 py-0.5 rounded-[var(--ds-radius-md)] font-semibold ds-mono cursor-pointer transition-colors ${
                          y.slug === selectedSlug
                            ? "bg-primary/15 text-primary"
                            : "text-text-muted hover:text-primary"
                        }`}
                      >
                        {y.ano}
                      </button>
                    ))
                )}
                {selectedGroup && selectedGroup.years.length === 1 && (
                  <span className="text-[10px] px-2 py-0.5 rounded-[var(--ds-radius-md)] bg-primary/15 text-primary font-semibold ds-mono">
                    {courseData.ano}
                  </span>
                )}
              </div>
            </div>

            {stats && (
              <div className="grid grid-cols-3 sm:flex sm:justify-center sm:gap-8 py-3 border-b border-border">
                <StatCard value={stats.total} label={t("home.stats.courses_evaluated")} />
                <StatCard value={stats.highest.toFixed(2)} label={t("home.stats.highest_score")} />
                <StatCard value={`${stats.trapPct}%`} label={t("home.stats.trap_pct")} />
              </div>
            )}

            <FilterBar
              filters={filters}
              uniqueUFs={uniqueUFs}
              resultCount={filtered.length}
              onUpdate={updateFilter}
              onClear={clearFilters}
            />

            <RankingTable
              avaliacoes={filtered}
              curso={courseData.curso}
              ano={courseData.ano}
              sort={sort}
              onToggleSort={toggleSort}
            />
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
