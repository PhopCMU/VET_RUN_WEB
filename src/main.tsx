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
          <Navbar />
          <div className="container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/page/registration" element={<Page />} />
              <Route path="/list/participants" element={<Table_list />} />
              <Route path="/sale/shirt" element={<SaleShirt />} />
              <Route path="/sale/shirt/tracking" element={<Tracking />} />
            </Routes>
          </div>
        </I18nProvider>
      </App>
    </BrowserRouter>
  </StrictMode>,
);
