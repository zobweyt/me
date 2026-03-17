import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerDirectives,
} from "unocss";
import {
  presetFunctionCompletion,
  presetObjectCompletion,
} from "unocss-preset-completion";

export default defineConfig({
  theme: {
    font: {
      sans: "var(--font-inter)",
      serif: "var(--font-lora)",
      mono: "var(--font-fira-code)",
    },
    colors: {
      body: "light-dark(oklch(97% 0 0), oklch(20.5% 0 0))",
      surface: "light-dark(oklch(92.2% 0 0), oklch(26.9% 0 0))",
      foreground: "light-dark(oklch(20.5% 0 0), oklch(97% 0 0))",
      selection: {
        DEFAULT:
          "light-dark(oklch(88.2% 0.059 254.128), oklch(37.9% 0.146 265.522))",
        foreground: "light-dark(oklch(20.5% 0 0), oklch(97% 0 0))",
      },
    },
  },
  presets: [
    presetWind4({
      dark: {
        light: '[data-theme="light"]',
        dark: '[data-theme="dark"]',
      },
    }),
    presetIcons(),
    presetTypography(),
    presetFunctionCompletion({
      autocompleteFunctions: ["cx", "cva"],
    }),
    presetObjectCompletion(),
  ],
  transformers: [transformerDirectives()],
});
