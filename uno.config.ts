import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerVariantGroup,
} from "unocss";

export default defineConfig({
  theme: {
    font: {
      sans: "var(--font-ibm-plex-sans)",
      serif: "var(--font-lora)",
      mono: "var(--font-fira-code)",
    },
    colors: {
      body: "light-dark(#FAFAFA, #18181B)",
      surface: "light-dark(#E4E4E7, #27272A)",
      foreground: "light-dark(#18181B, #FAFAFA)",
      accent: {
        DEFAULT: "light-dark(#BEDBFF, #1C398E)",
        foreground: "light-dark(#171717, #F5F5F5)",
      },
    },
  },
  content: {
    pipeline: {
      include: [
        /\.([jt]sx?|mdx?|astro|html)($|\?)/,
        "./src/**/*.{json,yaml,yml}",
      ],
    },
    filesystem: ["./src/**/*.{json,yaml,yml}"],
  },
  presets: [
    presetWind4({
      dark: {
        light: "[data-theme=light]",
        dark: "[data-theme=dark]",
      },
    }),
    presetIcons({
      cdn: "https://esm.sh/",
    }),
    presetTypography(),
  ],
  transformers: [transformerVariantGroup()],
});
