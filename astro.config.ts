import mdx from "@astrojs/mdx";
import vercel from "@astrojs/vercel";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { DEFAULT_LOCALE, LOCALES, SITEMAP_LOCALES } from "./src/i18n";

export default defineConfig({
  site: "https://zobweyt.vercel.app",
  i18n: {
    locales: Array.from(LOCALES),
    defaultLocale: DEFAULT_LOCALE,
  },
  output: "server",
  adapter: vercel(),
  markdown: {
    shikiConfig: {
      theme: "github-light-default",
    },
  },
  integrations: [
    mdx(),
    sitemap({
      i18n: {
        locales: SITEMAP_LOCALES,
        defaultLocale: DEFAULT_LOCALE,
      },
    }),
    tailwind(),
  ],
});
