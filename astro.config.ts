import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import { defineConfig, envField, fontProviders } from "astro/config";
import unocss from "unocss/astro";
import { DEFAULT_LOCALE, LOCALES, SITEMAP_LOCALES } from "./src/lib/i18n";

export default defineConfig({
  site: "https://zobweyt.vercel.app",
  env: {
    schema: {
      GITHUB_TOKEN: envField.string({ context: "server", access: "secret" }),
      CONTENT_RECENT_BLOG_POSTS_COUNT: envField.number({
        context: "server",
        access: "public",
      }),
      CONTENT_RECENT_PROJECTS_COUNT: envField.number({
        context: "server",
        access: "public",
      }),
    },
  },
  i18n: {
    locales: Array.from(LOCALES),
    defaultLocale: DEFAULT_LOCALE,
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "Inter",
      cssVariable: "--font-inter",
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      styles: ["normal", "italic"],
      subsets: ["cyrillic", "latin"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Lora",
      cssVariable: "--font-lora",
      weights: [400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["cyrillic", "latin"],
    },
    {
      provider: fontProviders.fontsource(),
      name: "Fira Code",
      cssVariable: "--font-fira-code",
      weights: [300, 400, 500, 600, 700],
      styles: ["normal", "italic"],
      subsets: ["cyrillic", "latin"],
    },
  ],
  output: "server",
  adapter: vercel({
    isr: true,
  }),
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light-default",
        dark: "github-dark-default",
      },
    },
  },
  integrations: [
    mdx(),
    react(),
    unocss({
      injectReset: true,
    }),
    sitemap({
      i18n: {
        locales: SITEMAP_LOCALES,
        defaultLocale: DEFAULT_LOCALE,
      },
    }),
  ],
});
