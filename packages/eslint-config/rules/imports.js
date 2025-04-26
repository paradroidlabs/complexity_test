// @ts-check
import tseslint from "typescript-eslint";

import * as importPlugin from "eslint-plugin-import";
import importAliasPlugin from "@limegrass/eslint-plugin-import-alias";

export default tseslint.config({
  plugins: {
    import: importPlugin,
    "@limegrass/import-alias": importAliasPlugin,
  },
  ignores: ["**/node_modules/**"],
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/ignore": ["node_modules", "\.json$"],
  },
  rules: {
    "import/no-unresolved": "error",
    "import/no-cycle": ["error", { ignoreExternal: true }],
    "import/no-self-import": "error",
    "import/order": [
      "warn",
      {
        groups: [
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index",
          "unknown",
        ],
        pathGroups: [
          {
            pattern: "**/*?script&module",
            group: "unknown",
            position: "after",
          },
        ],
        pathGroupsExcludedImportTypes: ["script-module"],
        "newlines-between": "always",
        alphabetize: {
          order: "asc",
          caseInsensitive: true,
        },
      },
    ],
    "@limegrass/import-alias/import-alias": "warn",
  },
});
