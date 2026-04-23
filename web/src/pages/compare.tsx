import { useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavBar } from "../components/nav-bar";
import { Footer } from "../components/footer";
import { SeoHead } from "../components/seo-head";
import { CompareCards } from "../components/compare-cards";
import { PositionContext } from "../components/position-context";
import { MetricBars } from "../components/metric-bars";
import { ProfileAnalysis } from "../components/profile-analysis";
import { FaixaProximity } from "../components/faixa-proximity";
import { SampleSizeCallout } from "../components/sample-size-callout";
import { TrapCallout } from "../components/trap-callout";
import { EvolutionChart } from "../components/evolution-chart";
import { useCourseData } from "../hooks/use-course-data";

export function Compare() {
  const { t } = useTranslation();
  const [params] = useSearchParams();

  const posA = Number(params.get("a"));
  const posB = Number(params.get("b"));
  const curso = params.get("curso") ?? "medicina";
  const ano = Number(params.get("ano") ?? 2023);
  const dataSlug = `${curso}-${ano}`;

  const courseData = useCourseData(dataSlug);

  const [avalA, avalB] = useMemo(() => {
    if (!courseData) return [null, null];
    const a = courseData.avaliacoes.find((av) => av.posicao === posA) ?? null;
    const b = courseData.avaliacoes.find((av) => av.posicao === posB) ?? null;
    return [a, b];
  }, [courseData, posA, posB]);

  const chartData = useMemo(() => {
    if (!avalA || !avalB) return [];
    return [
      {
        ano,
        [avalA.ies]: avalA.enade_continuo,
        [avalB.ies]: avalB.enade_continuo,
      },
    ];
  }, [avalA, avalB, ano]);

  if (!courseData) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col">
        <NavBar />
        <div className="ds-container p-8 text-center text-text-muted ds-mono flex-1">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!avalA || !avalB) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col">
        <NavBar />
        <div className="ds-container p-8 text-center text-text-muted ds-mono flex-1">
          Select two institutions to compare.{" "}
          <Link to="/" className="text-primary">
            Back to ranking
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const metrics = [
    {
      label: "Nota",
      valueA: avalA.enade_continuo,
      valueB: avalB.enade_continuo,
      max: 5,
      tooltip: t("compare.tip_score"),
    },
    { label: "FG", valueA: avalA.nota_fg, valueB: avalB.nota_fg, max: 100, tooltip: t("compare.tip_fg") },
    { label: "CE", valueA: avalA.nota_ce, valueB: avalB.nota_ce, max: 100, tooltip: t("compare.tip_ce") },
  ];

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <SeoHead
        title={`${avalA.ies} vs ${avalB.ies}`}
        description={`Comparação entre ${avalA.ies} e ${avalB.ies} no ENADE ${ano}`}
      />
      <NavBar />

      <div className="ds-container flex-1">
        {/* Breadcrumb */}
        <div className="py-2.5 text-[11px] text-text-muted border-b border-border ds-mono">
          <Link to="/" className="text-primary">
            {t("nav.ranking")}
          </Link>
          {" / "}
          <Link to="/" className="text-primary">
            {courseData.curso} {courseData.ano}
          </Link>
          {" / "}
          {t("compare.breadcrumb_compare")}
        </div>

        {/* Header */}
        <div className="text-center py-4 border-b border-border">
          <h2 className="text-primary text-sm font-semibold ds-mono">
            {courseData.curso} | {courseData.ano}
          </h2>
          <p className="text-text-muted text-[11px]">{t("compare.title")}</p>
        </div>

        <CompareCards a={avalA} b={avalB} />
        <PositionContext a={avalA} b={avalB} allAvaliacoes={courseData.avaliacoes} />
        <MetricBars metrics={metrics} />
        <ProfileAnalysis a={avalA} b={avalB} />
        <FaixaProximity a={avalA} b={avalB} />
        <SampleSizeCallout a={avalA} b={avalB} />
        <TrapCallout a={avalA} b={avalB} />
        <EvolutionChart
          data={chartData}
          iesA={avalA.ies}
          iesB={avalB.ies}
        />
      </div>

      <Footer />
    </div>
  );
}
