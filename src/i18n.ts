import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enLanguagePack from "@/locales/en.json";

/**
 * Default i18n configuration. Currently, unconditionally uses the default (english) language pack.
 */
i18n.use(initReactI18next).init({
  resources: {
    en: { ...enLanguagePack }
  },
  lng: "en",
  fallbackLng: "en",
  fallbackNS: "translations"
});
