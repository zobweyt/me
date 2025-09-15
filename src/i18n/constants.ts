import type { Locale } from "./types";

export const LOCALES = ["en", "ru"] as const;
export const DEFAULT_LOCALE: Locale = "en" as const;

export const SITEMAP_LOCALES = Object.fromEntries(LOCALES.map((_, i) => [LOCALES[i], LOCALES[i]]));
