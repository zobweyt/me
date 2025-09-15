import { DEFAULT_LOCALE, ui } from "./constants";

export function getTranslations(locale: string | undefined) {
  return function t(key: keyof (typeof ui)[typeof DEFAULT_LOCALE]) {
    return ui[locale as keyof typeof ui][key] || ui[DEFAULT_LOCALE][key];
  };
}
