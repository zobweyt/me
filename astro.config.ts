import { DEFAULT_LOCALE, LOCALES, SITEMAP_LOCALES } from "./src/i18n";
import { defineConfig } from "astro/config";
import icons from "unplugin-icons/vite";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

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
    react(),
  ],
  vite: {
    ssr: {
      noExternal: ["tw-animate-css"],
    },
    plugins: [
      icons({
        compiler: "astro",
        iconCustomizer(collection, icon, props) {
          props.width = "100%";
          props.height = "100%";
          props["aria-hidden"] = "true";
        },
      }),
      tailwindcss(),
    ],
  },
});
