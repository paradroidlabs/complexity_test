export const miscRules = {
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
};
