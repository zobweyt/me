import { DEFAULT_LOCALE } from "./constants";
import en from "./locales/en.json";
import ru from "./locales/ru.json";

export const translations = {
  en,
  ru,
} as const;

export const getTranslator = (locale: string | undefined) => {
  return (key: keyof (typeof translations)[typeof DEFAULT_LOCALE]) => {
    return translations[locale as keyof typeof translations][key] || translations[DEFAULT_LOCALE][key];
  };
};
