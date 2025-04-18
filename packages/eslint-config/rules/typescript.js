// @ts-check
import tseslint from "typescript-eslint";

export default tseslint.config({
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
  },
  rules: {
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/no-this-alias": "off",
    "@typescript-eslint/no-unsafe-declaration-merging": "error",
    "@typescript-eslint/no-unused-vars": [
      "warn",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
      },
    ],
    "@typescript-eslint/strict-boolean-expressions": [
      "warn",
      {
        allowNumber: true,
        allowNullableString: true,
        allowNullableNumber: false,
        allowNullableBoolean: true,
      },
    ],
    "prefer-const": "warn",
  },
});
