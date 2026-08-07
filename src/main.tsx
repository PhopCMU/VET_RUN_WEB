import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./index.css";
import "./i18n";
import "material-symbols";

// Router Pag
import App from "./App.tsx";
import Home from "./pages/home";
import Table_list from "./pages/table_list";
import Navbar from "./components/Navbar";
import Page from "./pages/page";

import { I18nProvider } from "./providers/I18nProvider.tsx";
import SaleShirt from "./pages/Sale_shirts/page.tsx";
import Tracking from "./pages/Sale_shirts/tracking.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <App>
        <I18nProvider>
          <a
            href="#main-content"
            className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-brand-700 px-4 py-3 font-semibold text-white shadow-lg transition-transform focus:translate-y-0"
          >
            Skip to content
          </a>
          <Navbar />
          <main id="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/page/registration" element={<Page />} />
              <Route path="/list/participants" element={<Table_list />} />
              <Route path="/sale/shirt" element={<SaleShirt />} />
              <Route path="/sale/shirt/tracking" element={<Tracking />} />
            </Routes>
          </main>
        </I18nProvider>
      </App>
    </BrowserRouter>
  </StrictMode>,
);
