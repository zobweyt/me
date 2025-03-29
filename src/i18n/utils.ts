import { DEFAULT_LOCALE, ui } from "./constants";

export function useTranslations(locale: string | undefined) {
  return function t(key: keyof (typeof ui)[typeof DEFAULT_LOCALE]) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    return ui[locale as keyof typeof ui][key] || ui[DEFAULT_LOCALE][key];
  };
}
