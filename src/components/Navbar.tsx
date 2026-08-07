import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { images } from "../constant";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("id");
  const router = useNavigate();

  useEffect(() => {
    setLanguage(i18n.language);
    if (
      search == null ||
      (search !== "participant" &&
        search !== "register" &&
        search !== "sale" &&
        search !== "tracking")
    ) {
      setSearchParams({ id: "" });
      router("/");
    }
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "th" : "en";
    i18n.changeLanguage(newLang);
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  useEffect(() => {
    // ดัน state ใหม่เข้าไปใน history
    window.history.pushState(null, "/", window.location.href);

    const handlePopState = () => {
      // เมื่อผู้ใช้กด back จะ push หน้าเดิมกลับเข้าไปอีก
      window.history.pushState(null, "/", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return (
    <motion.nav
      aria-label="Main navigation"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 px-4 py-3 shadow-[0_8px_30px_rgba(73,24,107,0.06)] backdrop-blur-xl"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
        {/* Logo and Brand Name */}
        <button
          type="button"
          onClick={() => router("/")}
          className="flex min-h-11 items-center gap-3 rounded-md text-left"
          aria-label="VET CMU RUN 2026 home"
        >
          <motion.img
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            src={images.logovetrun}
            alt="VET CMU RUN 2026"
            className="h-10 w-10 rounded-full border border-brand-100 object-cover md:h-11 md:w-11"
          />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="hidden text-lg font-bold text-brand-900 sm:block md:text-xl"
          >
            VET CMU RUN 2026
          </motion.h1>
        </button>

        {/* Language Toggle Button */}
        <div className="flex items-center gap-2">
          {search == "participant" ||
          search == "register" ||
          search == "sale" ||
          search == "tracking" ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router("/")}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-brand-200 bg-white px-3 py-2 font-semibold text-brand-700 transition-colors hover:bg-brand-50 sm:px-4"
              >
                <span className="material-symbols-outlined">
                  arrow_back_ios_new
                </span>
                <span className="lg:block hidden">
                  {t("table_list.arrow_back")}
                </span>
              </motion.button>
            </>
          ) : null}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            aria-label={`Switch to ${
              language === "en" ? "Thai" : "English"
            } language`}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand-700 px-3 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-brand-800 sm:px-4"
          >
            <span className="material-symbols-outlined">language</span>
            <span className="font-bold">{language.toUpperCase()}</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
