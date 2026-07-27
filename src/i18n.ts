import i18n from "i18next";
import { useEffect, useState } from "react";
import { initReactI18next } from "react-i18next";

const loadLocale = async (lng: string): Promise<Record<string, any>> => {
  const response = await fetch(`/locales/${lng}/translation.json`);
  return await response.json();
};

// Promise สำหรับบอกว่า locale พร้อมแล้ว
let resolveReadyPromise: (value: boolean) => void;
export const readyPromise = new Promise<boolean>((resolve) => {
  resolveReadyPromise = resolve;
});

i18n.use(initReactI18next).init({
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  ns: ["translation"],
  defaultNS: "translation",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
  resources: {
    en: { translation: {} },
    th: { translation: {} },
  },
});

// โหลด locale ทั้งสองภาษาตอนเริ่มต้น
Promise.all([
  loadLocale("en").then((data) => {
    i18n.addResourceBundle("en", "translation", data);
  }),
  loadLocale("th").then((data) => {
    i18n.addResourceBundle("th", "translation", data);
  }),
]).then(() => {
  resolveReadyPromise(true); // ✅ บอกว่าพร้อมแล้ว
});

//  custom hook ที่ใช้ตรวจสอบว่า locale พร้อมแล้วหรือยัง
export const useI18nReady = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      readyPromise.then(() => {
        setIsReady(true);
      });
    }, 2000);
  }, []);

  return isReady;
};

export default i18n;
