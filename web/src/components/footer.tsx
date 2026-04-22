import { useTranslation } from "react-i18next";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="text-center text-[10px] text-text-muted py-3 border-t border-border ds-mono">
      {t("footer.data_source", { year: 2023 })} |{" "}
      <a
        href="https://github.com/OpenEnade"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-primary transition-colors duration-[var(--ds-transition-fast)]"
      >
        {t("footer.open_source")}
      </a>
    </footer>
  );
}
