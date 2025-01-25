import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://zobweyt.vercel.app",
  markdown: {
    shikiConfig: {
      theme: "github-light-default",
    },
  },
  integrations: [mdx(), sitemap(), tailwind()],
});
