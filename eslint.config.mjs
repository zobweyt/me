import astroParser from "astro-eslint-parser";
import astroPlugin from "eslint-plugin-astro";
import typescriptParser from "@typescript-eslint/parser";
import typescriptPlugin from "typescript-eslint";

export default [
  {
    ignores: ["dist/", ".astro/", ".vercel/"],
  },
  ...typescriptPlugin.configs.recommended,
  ...astroPlugin.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: true,
      },
    },
  },
  {
    languageOptions: {
      parser: typescriptParser,
    },
    rules: {
      "no-console": "warn",

      "sort-imports": [
        "warn",
        {
          ignoreCase: true,
        },
      ],

      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],

      "@typescript-eslint/method-signature-style": "error",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "error",
      "@typescript-eslint/triple-slash-reference": "off",

      "@typescript-eslint/no-unused-expressions": [
        "error",
        {
          allowShortCircuit: true,
        },
      ],
    },
  },
  {
    files: ["**/*.{ts,tsx,astro}"],
    languageOptions: {
      parserOptions: {
        project: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/strict-boolean-expressions": "error",
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: astroParser,
      parserOptions: {
        parser: typescriptParser,
        extraFileExtensions: [".astro"],
      },
    },
  },
];
