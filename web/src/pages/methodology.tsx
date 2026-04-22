import { useTranslation } from "react-i18next";
import { NavBar } from "../components/nav-bar";
import { Footer } from "../components/footer";
import { SeoHead } from "../components/seo-head";

const CYCLE = [
  { year: "Ano 1 (2021, 2024)", areas: "Licenciaturas, Computacao, Ciencias Biologicas, Educacao Fisica" },
  { year: "Ano 2 (2022, 2025)", areas: "Direito, Administracao, Psicologia, Contabeis, Economia, Jornalismo" },
  { year: "Ano 3 (2023, 2026)", areas: "Medicina, Engenharias, Enfermagem, Farmacia, Agronomia, Odontologia" },
];

const BANDS = [
  { faixa: 1, min: "0.000", max: "0.944" },
  { faixa: 2, min: "0.945", max: "1.944" },
  { faixa: 3, min: "1.945", max: "2.944" },
  { faixa: 4, min: "2.945", max: "3.944" },
  { faixa: 5, min: "3.945", max: "5.000" },
];

const DATASETS = [
  { year: 2019, courses: 29, records: 8188, url: "https://download.inep.gov.br/educacao_superior/indicadores/resultados/2019/conceito_enade_2019.xlsx" },
  { year: 2021, courses: 22, records: 7512, url: "https://download.inep.gov.br/educacao_superior/indicadores/resultados/2021/conceito_enade_2021.xlsx" },
  { year: 2022, courses: 26, records: 8934, url: "https://download.inep.gov.br/educacao_superior/indicadores/resultados/2022/conceito_enade_2022.xlsx" },
  { year: 2023, courses: 28, records: 9380, url: "https://download.inep.gov.br/educacao_superior/indicadores/resultados/2023/conceito_enade_2023.xlsx" },
];

export function Methodology() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <SeoHead title="Metodologia" description="Como o OpenEnade processa os dados do ENADE: ciclo avaliativo, pipeline ETL e fontes de dados" />
      <NavBar />

      <div className="ds-container py-8 max-w-2xl flex-1">
        <h1 className="text-primary text-base font-semibold mb-6 ds-mono">
          {t("methodology.title")}
        </h1>

        {/* What is ENADE */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("methodology.what_is_enade")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("methodology.what_is_enade_body")}
          </p>
        </section>

        {/* Cycle */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("methodology.cycle_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            {t("methodology.cycle_body")}
          </p>
          <div className="ds-panel overflow-hidden">
            <table className="w-full text-xs ds-mono">
              <thead>
                <tr className="border-b border-border text-text-muted text-[10px] uppercase tracking-wider">
                  <th className="px-3 py-2 text-left">{t("methodology.cycle_year")}</th>
                  <th className="px-3 py-2 text-left">{t("methodology.cycle_areas")}</th>
                </tr>
              </thead>
              <tbody>
                {CYCLE.map((c) => (
                  <tr key={c.year} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-semibold whitespace-nowrap">{c.year}</td>
                    <td className="px-3 py-2 text-text-muted">{c.areas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Score vs Concept */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("methodology.score_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            {t("methodology.score_body")}
          </p>
          <div className="ds-panel overflow-hidden">
            <table className="w-full text-xs ds-mono">
              <thead>
                <tr className="border-b border-border text-text-muted text-[10px] uppercase tracking-wider">
                  <th className="px-3 py-2 text-left">{t("about.band_table.faixa")}</th>
                  <th className="px-3 py-2 text-left">{t("about.band_table.range")}</th>
                </tr>
              </thead>
              <tbody>
                {BANDS.map((b) => (
                  <tr key={b.faixa} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-semibold">{b.faixa}</td>
                    <td className="px-3 py-2 text-text-muted">{b.min} a {b.max}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FG and CE */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("methodology.components_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("methodology.components_body")}
          </p>
        </section>

        {/* Fair comparisons */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("methodology.comparison_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            {t("methodology.comparison_body")}
          </p>
          <div className="border-l-2 border-l-warning px-3.5 py-2.5 text-[11px] leading-relaxed">
            <div className="text-warning font-semibold text-[10px] uppercase tracking-wider mb-1 ds-mono">
              {t("methodology.caveat_title")}
            </div>
            <div className="text-text-muted">
              {t("methodology.caveat_body")}
            </div>
          </div>
        </section>

        <hr className="ds-separator" />

        {/* ETL pipeline */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("methodology.pipeline_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            {t("methodology.pipeline_body")}
          </p>
          <div className="text-sm font-semibold mb-2 ds-mono text-[11px]">
            {t("methodology.pipeline_steps_title")}
          </div>
          <ol className="text-sm text-text-muted leading-relaxed space-y-1.5 list-decimal list-inside">
            <li>{t("methodology.pipeline_step_1")}</li>
            <li>{t("methodology.pipeline_step_2")}</li>
            <li>{t("methodology.pipeline_step_3")}</li>
            <li>{t("methodology.pipeline_step_4")}</li>
            <li>{t("methodology.pipeline_step_5")}</li>
          </ol>
        </section>

        {/* What we extract */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("methodology.data_extracted_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("methodology.data_extracted_body")}
          </p>
        </section>

        {/* Datasets */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("methodology.datasets_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            {t("methodology.datasets_body")}
          </p>
          <div className="ds-panel overflow-hidden">
            <table className="w-full text-xs ds-mono">
              <thead>
                <tr className="border-b border-border text-text-muted text-[10px] uppercase tracking-wider">
                  <th className="px-3 py-2 text-left">{t("methodology.datasets_year")}</th>
                  <th className="px-3 py-2 text-left">{t("methodology.datasets_courses")}</th>
                  <th className="px-3 py-2 text-left">{t("methodology.datasets_records")}</th>
                  <th className="px-3 py-2 text-left">{t("methodology.datasets_link")}</th>
                </tr>
              </thead>
              <tbody>
                {DATASETS.map((d) => (
                  <tr key={d.year} className="border-b border-border last:border-0">
                    <td className="px-3 py-2 font-semibold">{d.year}</td>
                    <td className="px-3 py-2 text-text-muted">{d.courses}</td>
                    <td className="px-3 py-2 text-text-muted">{d.records.toLocaleString()}</td>
                    <td className="px-3 py-2">
                      <a
                        href={d.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-text transition-colors"
                      >
                        INEP/MEC
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Data source */}
        <section>
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("methodology.data_source")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("methodology.data_source_body")}
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
