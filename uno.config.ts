import {
  defineConfig,
  presetIcons,
  presetTypography,
  presetWind4,
  transformerDirectives,
  transformerVariantGroup,
} from "unocss";
import {
  presetFunctionCompletion,
  presetObjectCompletion,
} from "unocss-preset-completion";

export default defineConfig({
  theme: {
    font: {
      sans: "var(--font-ibm-plex-sans)",
      serif: "var(--font-lora)",
      mono: "var(--font-fira-code)",
    },
    colors: {
      body: "light-dark(oklch(98.5% 0 0), oklch(21% 0.006 285.885))",
      surface:
        "light-dark(oklch(92% 0.004 286.32), oklch(27.4% 0.006 286.033))",
      foreground: "light-dark(oklch(21% 0.006 285.885), oklch(98.5% 0 0))",
      selection: {
        DEFAULT:
          "light-dark(oklch(88.2% 0.059 254.128), oklch(37.9% 0.146 265.522))",
        foreground: "light-dark(oklch(20.5% 0 0), oklch(97% 0 0))",
      },
      success:
        "light-dark(oklch(62.7% 0.194 149.214), oklch(72.3% 0.219 149.579))",
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
    presetIcons(),
    presetTypography(),
    presetFunctionCompletion({
      autocompleteFunctions: ["cx", "cva"],
    }),
    presetObjectCompletion(),
  ],
  transformers: [transformerDirectives(), transformerVariantGroup()],
});
