import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./i18n";
import "./app.css";
import { ErrorBoundary } from "./components/error-boundary";
import { Home } from "./pages/home";
import { Ranking } from "./pages/ranking";
import { About } from "./pages/about";
import { Methodology } from "./pages/methodology";
import { NotFound } from "./pages/not-found";

const Compare = lazy(() =>
  import("./pages/compare").then((m) => ({ default: m.Compare }))
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ranking/:slug" element={<Ranking />} />
            <Route
              path="/comparar"
              element={
                <Suspense fallback={<div className="min-h-screen bg-background" />}>
                  <Compare />
                </Suspense>
              }
            />
            <Route path="/sobre" element={<About />} />
            <Route path="/metodologia" element={<Methodology />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ErrorBoundary>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
