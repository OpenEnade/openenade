import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavBar } from "../components/nav-bar";
import { Footer } from "../components/footer";
import { SeoHead } from "../components/seo-head";
import { StatCard } from "../components/stat-card";
import { FilterBar } from "../components/filter-bar";
import { RankingTable } from "../components/ranking-table";
import { useCourseData, useCourseIndex } from "../hooks/use-course-data";
import { useFilters } from "../hooks/use-filters";

interface CourseGroup {
  nome: string;
  years: { ano: number; slug: string }[];
}

export function Ranking() {
  const { t } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const courseIndex = useCourseIndex();
  const courseData = useCourseData(slug ?? "");

  const avaliacoes = courseData?.avaliacoes ?? [];
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

  const courseGroup = useMemo(() => {
    if (!courseData) return null;
    const group: CourseGroup = { nome: courseData.curso, years: [] };
    for (const c of courseIndex) {
      if (c.nome === courseData.curso) {
        group.years.push({ ano: c.ano, slug: c.slug });
      }
    }
    group.years.sort((a, b) => b.ano - a.ano);
    return group;
  }, [courseData, courseIndex]);

  if (!courseData) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col">
        <NavBar />
        <div className="ds-container flex-1 p-8 text-center text-text-muted ds-mono">
          Loading...
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <SeoHead
        title={`${courseData.curso} ${courseData.ano}`}
        description={`Ranking de ${courseData.curso} no ENADE ${courseData.ano}: ${courseData.total} IES avaliadas`}
        ogImage={`https://openenade.emanueljoivo.com/og/${slug}.png`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Dataset",
          "name": `ENADE ${courseData.curso} ${courseData.ano}`,
          "description": `Ranking de ${courseData.total} instituições no ENADE ${courseData.ano} para ${courseData.curso}`,
          "url": `https://openenade.emanueljoivo.com/ranking/${slug}`,
          "license": "https://opensource.org/licenses/MIT",
        }}
      />
      <NavBar />

      <div className="ds-container flex-1">
        <div className="flex items-center justify-between py-3 border-b border-border">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="text-text-muted hover:text-primary transition-colors ds-mono text-xs"
            >
              &lt;
            </Link>
            <div>
              <h2 className="text-sm sm:text-base font-semibold ds-mono">{courseData.curso}</h2>
              <span className="text-[10px] text-text-muted ds-mono">ENADE {courseData.ano} | {courseData.total} IES avaliadas</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {courseGroup && courseGroup.years.length > 1 && (
              courseGroup.years.map((y) => (
                <button
                  key={y.ano}
                  onClick={() => navigate(`/ranking/${y.slug}`)}
                  className={`text-[10px] px-2 py-0.5 rounded-[var(--ds-radius-md)] font-semibold ds-mono cursor-pointer transition-colors ${
                    y.slug === slug
                      ? "bg-primary/15 text-primary"
                      : "text-text-muted hover:text-primary"
                  }`}
                >
                  {y.ano}
                </button>
              ))
            )}
            {courseGroup && courseGroup.years.length === 1 && (
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
      </div>

      <Footer />
    </div>
  );
}
