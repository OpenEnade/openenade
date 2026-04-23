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
  const [menuOpen, setMenuOpen] = useState(false);

  function toggleLang() {
    const next = i18n.language === "pt" ? "en" : "pt";
    i18n.changeLanguage(next);
    localStorage.setItem("openenade-lang", next);
  }

  return (
    <nav className="border-b border-border ds-mono">
      <div className="flex items-center justify-between px-3 sm:px-4 py-2.5 sm:py-3">
        <Link to="/" className="text-primary font-semibold text-xs sm:text-sm ds-crt-glow">
          &gt; OpenEnade
        </Link>
        <div className="flex gap-2 sm:gap-4 text-text-muted text-[10px] sm:text-xs items-center">
          {/* Desktop links */}
          <Link to="/" className="hidden sm:inline hover:text-primary transition-colors duration-[var(--ds-transition-fast)]">
            {t("nav.ranking")}
          </Link>
          <Link to="/sobre" className="hidden sm:inline hover:text-primary transition-colors duration-[var(--ds-transition-fast)]">
            {t("nav.about")}
          </Link>
          <Link to="/metodologia" className="hidden sm:inline hover:text-primary transition-colors duration-[var(--ds-transition-fast)]">
            {t("nav.methodology")}
          </Link>
          <button
            onClick={toggleTheme}
            className="hover:text-primary transition-colors duration-[var(--ds-transition-fast)] cursor-pointer"
          >
            {theme === "dark" ? "☀" : "☾"}
          </button>
          <button
            onClick={toggleLang}
            className="hover:text-primary transition-colors duration-[var(--ds-transition-fast)] cursor-pointer"
          >
            {t("nav.lang_toggle")}
          </button>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="sm:hidden hover:text-primary transition-colors duration-[var(--ds-transition-fast)] cursor-pointer w-6 h-6 flex items-center justify-center text-base"
            aria-label="Menu"
          >
            {menuOpen ? "\u00d7" : "\u2261"}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden border-t border-border px-3 py-2 flex flex-col gap-2 text-[11px] text-text-muted">
          <Link
            to="/"
            onClick={() => setMenuOpen(false)}
            className="hover:text-primary transition-colors py-1"
          >
            {t("nav.ranking")}
          </Link>
          <Link
            to="/sobre"
            onClick={() => setMenuOpen(false)}
            className="hover:text-primary transition-colors py-1"
          >
            {t("nav.about")}
          </Link>
          <Link
            to="/metodologia"
            onClick={() => setMenuOpen(false)}
            className="hover:text-primary transition-colors py-1"
          >
            {t("nav.methodology")}
          </Link>
        </div>
      )}
    </nav>
  );
}
