import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Import translation files
import translationEN from "./lib/locales/en/translation.json";
import translationMS from "./lib/locales/ms/translation.json";

// Initialize i18next with resources
i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translationEN },
    ms: { translation: translationMS },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
