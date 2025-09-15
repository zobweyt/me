import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import AutoImport from "unplugin-auto-import/vite";
import IconsResolver from "unplugin-icons/resolver";
import icons from "unplugin-icons/vite";

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
    react(),
  ],
  vite: {
    ssr: {
      noExternal: ["tw-animate-css"],
    },
    plugins: [
      AutoImport({
        resolvers: [
          IconsResolver({
            prefix: "Icon",
            extension: "jsx",
          }),
          IconsResolver({
            prefix: "Icon",
            extension: "astro",
          }),
        ],
      }),
      icons({
        jsx: "react",
        compiler: "jsx",
        iconCustomizer: (collection, icon, props) => {
          props.width = "100%";
          props.height = "100%";
          props["aria-hidden"] = "true";
        },
      }),
      tailwindcss(),
    ],
  },
});
