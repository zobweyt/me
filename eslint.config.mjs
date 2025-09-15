import parserTypescript from "@typescript-eslint/parser";
import parserAstro from "astro-eslint-parser";
import { defineConfig } from "eslint/config";
import pluginImport from "eslint-plugin-import-x";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReactRefresh from "eslint-plugin-react-refresh";
import typescript from "typescript-eslint";

export default defineConfig([
  {
    ignores: [".astro", ".vercel", "dist"],
  },
  pluginImport.flatConfigs.recommended,
  pluginImport.flatConfigs.typescript,
  typescript.configs.recommended,
  pluginReactHooks.configs["recommended-latest"],
  pluginReactRefresh.configs.vite,
  {
    rules: {
      "import-x/default": "off",
      "import-x/no-named-as-default-member": "off",
      "import-x/no-named-as-default": "off",
      "import-x/no-unresolved": "off",
      "import-x/order": [
        "error",
        {
          alphabetize: {
            order: "asc",
            orderImportKind: "asc",
            caseInsensitive: false,
          },
          "newlines-between": "always",
          warnOnUnassignedImports: false,
          groups: ["builtin", "external", "internal", ["parent", "sibling"], "index"],
        },
      ],
    },
  },
  {
    files: ["**/*.astro"],
    languageOptions: {
      parser: parserAstro,
      parserOptions: {
        parser: parserTypescript,
        extraFileExtensions: [".astro"],
      },
    },
  },
]);
