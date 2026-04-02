import * as Localization from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enCommon from "./en/common.json";
import esCommon from "./es/common.json";

import enSettings from "./en/settings.json";
import esSettings from "./es/settings.json";

import enVideos from "./en/videos.json";
import esVideos from "./es/videos.json";

import enCategories from "./en/categories.json";
import esCategories from "./es/categories.json";

i18n.use(initReactI18next).init({
  lng: Localization.getLocales()[0].languageCode || "en",
  fallbackLng: "en",
  resources: {
    en: {
      common: enCommon,
      settings: enSettings,
      videos: enVideos,
      categories: enCategories,
    },
    es: {
      common: esCommon,
      settings: esSettings,
      videos: esVideos,
      categories: esCategories,
    },
  },
  ns: ["common", "settings", "videos", "categories", "modal", "form"],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
