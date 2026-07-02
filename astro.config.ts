import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import {
  defineConfig,
  envField,
  fontProviders,
  memoryCache,
} from "astro/config";
import unocss from "unocss/vite";
import { DEFAULT_LOCALE, LOCALES, SITEMAP_LOCALES } from "./src/lib/i18n";

export default defineConfig({
  site: "https://zobweyt.vercel.app",
  env: {
    schema: {
      GITHUB_TOKEN: envField.string({ context: "server", access: "secret" }),
      CONTENT_RECENT_POSTS_COUNT: envField.number({
        context: "server",
        access: "public",
      }),
      CONTENT_RECENT_PROJECTS_COUNT: envField.number({
        context: "server",
        access: "public",
      }),
    },
  },
  vite: {
    plugins: [unocss()],
  },
  i18n: {
    locales: Array.from(LOCALES),
    defaultLocale: DEFAULT_LOCALE,
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
      fallbackType: "rewrite",
    },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: "IBM Plex Sans",
      cssVariable: "--font-ibm-plex-sans",
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
    isr: {
      exclude: ["/", "/ru", "/en", "/api/*"],
      expiration: 60,
    },
  }),
  cache: {
    provider: memoryCache(),
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  routeRules: {
    "[locale]/blog": { maxAge: 300, swr: 60 },
    "[locale]/blog/[...id]": { maxAge: 300, swr: 60 },
  },
  markdown: {
    shikiConfig: {
      themes: {
        light: "github-light-default",
        dark: "github-dark-default",
      },
    },
    // TODO: custom pre tag in astro v7 broke, setting this to false helps now
    syntaxHighlight: false,
  },
  integrations: [
    mdx(),
    react(),
    sitemap({
      i18n: {
        locales: SITEMAP_LOCALES,
        defaultLocale: DEFAULT_LOCALE,
      },
    }),
  ],
  experimental: {
    clientPrerender: true,
    contentIntellisense: true,
  },
});
