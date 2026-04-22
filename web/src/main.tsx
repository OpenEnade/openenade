import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import "./app.css";
import { Home } from "./pages/home";
import { Compare } from "./pages/compare";
import { About } from "./pages/about";
import { Methodology } from "./pages/methodology";
import { NotFound } from "./pages/not-found";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/comparar" element={<Compare />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/metodologia" element={<Methodology />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
