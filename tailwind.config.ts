import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Rubik Variable", ...defaultTheme.fontFamily.sans],
        serif: ["Lora Variable", ...defaultTheme.fontFamily.serif],
        mono: ["Fira Code Variable", ...defaultTheme.fontFamily.mono],
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(function ({ addBase }) {
      addBase({
        html: {
          "color-scheme": "light",
          "margin-left": "calc(100vw - 100%)",
          "margin-right": "0",
        },
      });
    }),
    plugin(function ({ addVariant }) {
      addVariant("prose-inline-code", '&.prose :where(:not(pre)>code):not(:where([class~="not-prose"] *))');
    }),
  ],
} satisfies Config;
