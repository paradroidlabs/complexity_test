export const boundariesPluginSettings = {
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
};

export const boundariesRules = {
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
};
