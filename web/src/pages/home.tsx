import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { NavBar } from "../components/nav-bar";
import { Footer } from "../components/footer";
import { SeoHead } from "../components/seo-head";
import { useCourseIndex } from "../hooks/use-course-data";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return courseGroups;
    const q = searchQuery.toLowerCase();
    return courseGroups.filter((g) => g.nome.toLowerCase().includes(q));
  }, [courseGroups, searchQuery]);

  const globalStats = useMemo(() => {
    if (courseGroups.length === 0) return null;
    const uniqueCourses = courseGroups.length;
    const totalRecords = courseIndex.reduce((sum, c) => sum + c.total, 0);
    const years = [...new Set(courseIndex.map((c) => c.ano))].sort();
    return { uniqueCourses, totalRecords, years };
  }, [courseGroups, courseIndex]);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <SeoHead />
      <NavBar />

      <div className="ds-container flex-1">
        {/* Hero */}
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
              <span>{globalStats.totalRecords.toLocaleString()} avaliações</span>
            </div>
          )}
        </div>

        {/* Course browser */}
        <div className="py-4 sm:py-6">
          <p className="text-center text-text-muted text-[10px] sm:text-xs ds-mono mb-4">
            {t("home.onboarding")}
          </p>
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
              <Link
                key={g.nome}
                to={`/ranking/${g.latestSlug}`}
                className="ds-panel px-3 py-2.5 text-left ds-row-hover cursor-pointer transition-colors"
              >
                <div className="text-[10px] sm:text-[11px] font-semibold ds-mono truncate">{g.nome}</div>
                <div className="text-[9px] sm:text-[10px] text-text-muted ds-mono">
                  {g.latestTotal} IES | {g.latestYear}
                  {g.years.length > 1 && (
                    <span className="text-primary ml-1">+{g.years.length - 1} ano{g.years.length > 2 ? "s" : ""}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {filteredGroups.length === 0 && searchQuery && (
            <p className="text-center text-text-muted text-xs ds-mono py-8">
              Nenhum curso encontrado para "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
