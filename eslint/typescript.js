import importAliasPlugin from "@limegrass/eslint-plugin-import-alias";
import tseslint from "typescript-eslint";

export const typescriptConfig = {
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      alwaysTryTypes: true,
      project: "./tsconfig.json",
    },
  },
  plugins: {
    "@typescript-eslint": tseslint.plugin,
    "@limegrass/import-alias": importAliasPlugin,
  },
  rules: {
    "@typescript-eslint/no-restricted-types": [
      "error",
      {
        types: {
          "{}": {
            message: "Use a more specific type instead of empty object type {}",
            fixWith: "Record<string, unknown>",
          },
        },
      },
    ],
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/strict-boolean-expressions": [
      "warn",
      {
        allowNumber: true,
        allowNullableString: true,
        allowNullableNumber: false,
        allowNullableBoolean: true,
      },
    ],
    "@limegrass/import-alias/import-alias": ["warn"],
  },
};
