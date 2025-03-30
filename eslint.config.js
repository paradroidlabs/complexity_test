import importAliasPlugin from "@limegrass/eslint-plugin-import-alias";
import boundariesPlugin from "eslint-plugin-boundaries";
import importPlugin from "eslint-plugin-import";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import reactRefreshPlugin from "eslint-plugin-react-refresh";
import unicornPlugin from "eslint-plugin-unicorn";
import globals from "globals";
import tseslint from "typescript-eslint";

import {
  boundariesPluginSettings,
  boundariesRules,
} from "./eslint/boundaries.js";
import { importPluginSettings, importRules } from "./eslint/imports.js";
import { miscRules } from "./eslint/misc.js";
import { reactPluginSettings, reactRules } from "./eslint/react.js";
import { typescriptConfig } from "./eslint/typescript.js";

const commonSettings = {
  ...reactPluginSettings,
  ...importPluginSettings,
  ...boundariesPluginSettings,
};

const commonPlugins = {
  react: reactPlugin,
  "react-hooks": reactHooksPlugin,
  "react-refresh": reactRefreshPlugin,
  unicorn: unicornPlugin,
  import: importPlugin,
  "@limegrass/import-alias": importAliasPlugin,
  boundaries: boundariesPlugin,
};

const commonIgnores = [
  "dist/**",
  "node_modules/**",
  "*.config.js",
  "*.config.ts",
  "gulpfile.js",
  "src/manifest.chrome.ts",
  "src/manifest.firefox.ts",
  "src/manifest.base.ts",
];

const baseConfig = {
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: "module",
    globals: {
      ...globals.browser,
      ...globals.es2020,
    },
  },
  linterOptions: {
    reportUnusedDisableDirectives: true,
  },
  ignores: commonIgnores,
  settings: commonSettings,
  plugins: commonPlugins,
  rules: {
    ...reactRules,
    ...importRules,
    ...boundariesRules,
    ...miscRules,
  },
};

export default tseslint.config(baseConfig, typescriptConfig);
