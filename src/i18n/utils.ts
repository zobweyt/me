import { ui, DEFAULT_LOCALE } from "./constants";

export function useTranslations(locale: string | undefined) {
  return function t(key: keyof (typeof ui)[typeof DEFAULT_LOCALE]) {
    return ui[locale as keyof typeof ui][key] || ui[DEFAULT_LOCALE][key];
  };
}
