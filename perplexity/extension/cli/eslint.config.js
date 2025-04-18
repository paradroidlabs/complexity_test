// @ts-check
import {
  baseConfig,
  baseImportConfig,
  baseTypescriptConfig,
} from "@complexity/eslint-config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  baseConfig,
  baseTypescriptConfig,
  {
    ...baseImportConfig[0],
    ignores: ["node_modules/**", "*.config.js", "*.config.ts"],
  },
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
    },
    ignores: ["node_modules/**"],
  },
);
