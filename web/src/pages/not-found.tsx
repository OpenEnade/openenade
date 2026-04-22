import { Link } from "react-router-dom";
import { NavBar } from "../components/nav-bar";
import { Footer } from "../components/footer";
import { SeoHead } from "../components/seo-head";

export function NotFound() {
  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <SeoHead title="404" description="Página não encontrada" />
      <NavBar />
      <div className="ds-container flex-1 flex items-center justify-center">
        <div className="text-center ds-mono">
          <div className="text-4xl sm:text-6xl font-bold text-primary mb-2">404</div>
          <p className="text-text-muted text-xs sm:text-sm mb-4">Página não encontrada</p>
          <Link
            to="/"
            className="text-xs text-primary hover:text-text transition-colors"
          >
            &gt; voltar ao ranking
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
