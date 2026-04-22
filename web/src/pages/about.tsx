import { useTranslation } from "react-i18next";
import { NavBar } from "../components/nav-bar";
import { Footer } from "../components/footer";

const BANDS = [
  { faixa: 1, min: "0.000", max: "0.944" },
  { faixa: 2, min: "0.945", max: "1.944" },
  { faixa: 3, min: "1.945", max: "2.944" },
  { faixa: 4, min: "2.945", max: "3.944" },
  { faixa: 5, min: "3.945", max: "5.000" },
];

const TEAM = [
  { name: "Igor Farias", github: "igoratf", role: "origin" },
  { name: "Paulo Felipe Feitosa", github: "paulofelipefeitosa", role: "origin" },
  { name: "Lucas Victor", github: "lucasvictor3", role: "origin" },
  { name: "Ícaro Lima", github: "Icaro-Lima", role: "origin" },
  { name: "Javan Lacerda", github: "javanlacerda", role: "origin" },
  { name: "Emanuel Joivo", github: "joivo", role: "all" },
  { name: "Amanda Luna", github: "avdLuna", role: "contributor" },
  { name: "David Quaresma", github: "dfquaresma", role: "contributor" },
  { name: "Paulo Dantas", github: "paulovitorccc", role: "contributor" },
  { name: "Renato Henriques", github: "renatodh", role: "contributor" },
];

export function About() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <NavBar />

      <div className="ds-container py-8 max-w-2xl flex-1">
        <h1 className="text-primary text-base font-semibold mb-6 ds-mono">
          {t("about.title")}
        </h1>

        {/* What is OpenEnade */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("about.what_is_openenade")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("about.openenade_body")}
          </p>
        </section>

        {/* What is ENADE */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("about.what_is_enade")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("about.what_is_enade_body")}
          </p>
        </section>

        {/* Conceito trap */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("about.what_is_conceito")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            {t("about.conceito_body")}
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

        {/* Data source */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("about.data_source")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("about.data_source_body")}
          </p>
        </section>

        {/* Tech stack */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("about.tech_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("about.tech_body")}
          </p>
        </section>

        <hr className="ds-separator" />

        {/* Origin */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("about.origin_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("about.origin_body")}
          </p>
        </section>

        {/* What happened */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("about.what_happened_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("about.what_happened_body")}
          </p>
        </section>

        {/* Team */}
        <section className="mb-6">
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("about.team_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed mb-3">
            {t("about.team_body")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {TEAM.map((member) => (
              <a
                key={member.github}
                href={`https://github.com/${member.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="ds-panel px-3 py-2 ds-row-hover flex items-center gap-2"
              >
                <img
                  src={`https://github.com/${member.github}.png?size=32`}
                  alt={member.name}
                  className="w-6 h-6 rounded-[var(--ds-radius-sm)]"
                />
                <div>
                  <div className="text-[11px] font-semibold ds-mono">{member.name}</div>
                  <div className="text-[9px] text-text-muted ds-mono">@{member.github}</div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Resurrection */}
        <section>
          <h2 className="text-sm font-semibold mb-2 ds-mono ds-prefix">
            {t("about.resurrection_title")}
          </h2>
          <p className="text-sm text-text-muted leading-relaxed">
            {t("about.resurrection_body")}
          </p>
        </section>
      </div>

      <Footer />
    </div>
  );
}
