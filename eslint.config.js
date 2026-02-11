// @ts-check

import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.node,
    },
  },

  tseslint.configs.recommended,

  {
    files: ["src/api/**/*.ts"],
    languageOptions: {
      globals: globals.worker,
    },
  },

  {
    files: ["src/web/**/*.ts"],
    languageOptions: {
      globals: globals.browser,
    },
  },

  globalIgnores(["./worker-configuration.d.ts", "./dist/"]),
);
