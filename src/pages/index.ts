import type { APIRoute } from "astro";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/lib/i18n";

export const GET: APIRoute = async ({ preferredLocale, redirect }) => {
  return redirect(
    LOCALES.includes(preferredLocale as Locale)
      ? (preferredLocale as Locale)
      : DEFAULT_LOCALE,
  );
};
