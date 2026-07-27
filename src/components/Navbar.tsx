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
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-gradient-to-r from-[#a66941] via-[#c6895a] to-[#d79b65] p-4 shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Brand Name */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <motion.img
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            src={images.logovetrun}
            alt="Logo"
            className="h-10 w-10 md:h-12 md:w-12 drop-shadow-lg rounded-full"
          />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-white text-xl md:text-3xl font-bold tracking-tight hidden md:block"
          >
            VET CMU RUN 2025
          </motion.h1>
        </div>

        {/* Language Toggle Button */}
        <div className="flex items-center gap-x-3">
          {search == "participant" ||
          search == "register" ||
          search == "sale" ||
          search == "tracking" ? (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router("/")}
                className="bg-[#8a5635] text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-[#6d452a] transition-colors flex items-center space-x-2"
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
            className="bg-[#8a5635] text-white px-4 py-2 rounded-full font-medium shadow-md hover:bg-[#6d452a] transition-colors flex items-center space-x-2"
          >
            <span className="material-symbols-outlined">language</span>
            <span className="font-bold">{language.toUpperCase()}</span>
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
