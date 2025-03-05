module.exports = {
  root: true,
  env: { browser: true, es2020: true },

  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },

  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],

  plugins: [
    "react",
    "react-refresh",
    "unicorn",
    "@limegrass/import-alias",
    "boundaries",
  ],

  ignorePatterns: ["dist", ".eslintrc.cjs"],

  settings: {
    react: { version: "detect" },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
    "boundaries/include": ["src/**/*"],
    "boundaries/elements": [
      {
        type: "shared",
        mode: "full",
        pattern: [
          "src/*.ts",
          "src/components/**/*",
          "src/assets/**/*",
          "src/hooks/**/*",
          "src/services/**/*",
          "src/types/**/*",
          "src/utils/**/*",
          "src/data/**/*",
        ],
      },
      {
        type: "entrypoint",
        mode: "full",
        pattern: ["src/entrypoints/**/*"],
      },
      {
        type: "plugin-core",
        mode: "full",
        pattern: ["src/plugins/_api/**/*", "src/plugins/_core/**/*"],
      },
      {
        type: "plugin",
        mode: "full",
        capture: ["pluginName"],
        pattern: ["src/plugins/*/**/*"],
      },
    ],
  },

  rules: {
    // TypeScript rules
    "@typescript-eslint/ban-types": [
      "error",
      {
        types: {
          "{}": false,
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

    // React rules
    "react-refresh/only-export-components": [
      "warn",
      { allowConstantExport: true },
    ],
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-sort-props": [
      "warn",
      {
        callbacksLast: true,
        shorthandFirst: true,
        ignoreCase: true,
        reservedFirst: true,
        noSortAlphabetically: true,
      },
    ],
    "react/jsx-no-useless-fragment": [
      "warn",
      {
        allowExpressions: true,
      },
    ],

    // Import rules
    "import/no-cycle": "error",
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
    "@limegrass/import-alias/import-alias": "off",

    // Boundaries rules
    "boundaries/no-unknown": ["error"],
    "boundaries/no-unknown-files": ["error"],
    "boundaries/element-types": [
      "error",
      {
        default: "disallow",
        rules: [
          {
            from: "shared",
            allow: ["shared", "plugin-core"],
          },
          {
            from: "entrypoint",
            allow: ["entrypoint", "shared", "plugin-core", "plugin"],
          },
          {
            from: "plugin-core",
            allow: ["shared", "plugin-core", "plugin"],
          },
          {
            from: "plugin",
            allow: [
              "shared",
              "plugin-core",
              "plugin",
              ["plugin", { pluginName: "${from.pluginName}" }],
            ],
          },
        ],
      },
    ],

    // Other rules
    "prefer-rest-params": "off",
    "unicorn/filename-case": [
      "error",
      {
        cases: {
          pascalCase: true,
          kebabCase: true,
          camelCase: true,
        },
        ignore: ["\\.d\\.ts$"],
      },
    ],
  },

  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      rules: {
        "@limegrass/import-alias/import-alias": ["warn"],
      },
    },
  ],
};
