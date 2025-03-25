export const importPluginSettings = {
  "import/resolver": {
    typescript: {
      alwaysTryTypes: true,
      project: "./tsconfig.json",
    },
  },
};

export const importRules = {
  "import/no-unresolved": "error",
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
};
