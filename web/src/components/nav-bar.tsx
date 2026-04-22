import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function useTheme() {
  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return (localStorage.getItem("openenade-theme") as "dark" | "light") || "dark";
  });

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem("openenade-theme", theme);
  }, [theme]);

  const toggle = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return { theme, toggle };
}

export function NavBar() {
  const { t, i18n } = useTranslation();
  const { theme, toggle: toggleTheme } = useTheme();

  function toggleLang() {
    const next = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(next);
    localStorage.setItem("openenade-lang", next);
  }

  return (
    <nav className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3 border-b border-border ds-mono">
      <Link to="/" className="text-primary font-semibold text-xs sm:text-sm ds-crt-glow">
        &gt; OpenEnade
      </Link>
      <div className="flex gap-2 sm:gap-4 text-text-muted text-[10px] sm:text-xs">
        <Link to="/" className="hover:text-primary transition-colors duration-[var(--ds-transition-fast)]">
          {t("nav.ranking")}
        </Link>
        <Link to="/sobre" className="hidden sm:inline hover:text-primary transition-colors duration-[var(--ds-transition-fast)]">
          {t("nav.about")}
        </Link>
        <Link to="/metodologia" className="hidden md:inline hover:text-primary transition-colors duration-[var(--ds-transition-fast)]">
          {t("nav.methodology")}
        </Link>
        <button
          onClick={toggleTheme}
          className="hover:text-primary transition-colors duration-[var(--ds-transition-fast)] cursor-pointer"
        >
          {theme === "dark" ? "LIGHT" : "DARK"}
        </button>
        <button
          onClick={toggleLang}
          className="hover:text-primary transition-colors duration-[var(--ds-transition-fast)] cursor-pointer"
        >
          {t("nav.lang_toggle")}
        </button>
      </div>
    </nav>
  );
}
