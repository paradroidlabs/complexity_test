// @ts-check
import boundariesPlugin from "eslint-plugin-boundaries";
import tseslint from "typescript-eslint";

export default tseslint.config({
  plugins: {
    boundaries: boundariesPlugin,
  },
  settings: {
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
        capture: ["entrypointName"],
        pattern: ["src/entrypoints/*/**/*"],
      },
      {
        type: "plugin-core",
        mode: "full",
        pattern: ["src/plugins/_api/**/*", "src/plugins/_core/**/*"],
      },
      {
        type: "plugin-public-exports",
        mode: "full",
        capture: ["pluginName"],
        pattern: ["src/plugins/*/**/*.public.*"],
      },
      {
        type: "plugin-settings-ui",
        mode: "full",
        capture: ["pluginName"],
        pattern: ["src/plugins/*/**/settings-ui.tsx"],
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
    "boundaries/no-unknown": ["error"],
    "boundaries/no-unknown-files": ["error"],
    "boundaries/element-types": [
      "error",
      {
        default: "disallow",
        rules: [
          {
            from: "shared",
            allow: ["shared", "plugin-core", "plugin-public-exports"],
          },
          {
            from: "entrypoint",
            allow: [
              "entrypoint",
              "shared",
              "plugin-core",
              "plugin-public-exports",
            ],
          },
          {
            from: "plugin-core",
            allow: ["shared", "plugin-core", "plugin", "plugin-public-exports"],
          },
          {
            from: "plugin",
            allow: [
              "shared",
              "plugin-core",
              "plugin-public-exports",
              ["plugin", { pluginName: "${from.pluginName}" }],
            ],
            disallow: [
              ["plugin-public-exports", { pluginName: "${from.pluginName}" }],
            ],
          },
          {
            from: "plugin-public-exports",
            allow: [["plugin", { pluginName: "${from.pluginName}" }]],
          },
          {
            from: "plugin-settings-ui",
            allow: [
              "shared",
              "plugin-core",
              "plugin-public-exports",
              ["plugin", { pluginName: "${from.pluginName}" }],
              ["entrypoint", { entrypointName: "options-page" }],
            ],
            disallow: [
              ["plugin-public-exports", { pluginName: "${from.pluginName}" }],
            ],
          },
        ],
      },
    ],
  },
});
