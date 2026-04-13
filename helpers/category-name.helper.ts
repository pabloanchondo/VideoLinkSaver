import * as Localization from "expo-localization";

export const getCategoryNameByi18n = () => {
  let langCode = Localization.getLocales()[0].languageCode || "en";
  switch (langCode) {
    case "es":
      return "Sin categoría";
    case "en":
    default:
      return "No category";
  }
};
