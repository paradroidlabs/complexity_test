/// <reference types="vitest" />

import * as path from "path";
import { defineConfig } from "vite";
import { crx } from "@crxjs/vite-plugin";
import react from "@vitejs/plugin-react";
import Unimport from "unimport/unplugin";

import chromeManifest from "./src/manifest.chrome";
import firefoxManifest from "./src/manifest.firefox";
import { APP_CONFIG } from "./src/app.config";
import unimportConfig from "./src/types/unimport.config";
import tailwindcss from "@tailwindcss/vite";

import vitePluginForceRestartOnChanges from "./vite-plugins/vite-plugin-force-restart-on-changes";
import vitePluginReloadOnDynamicallyInjectedStyleChanges from "./vite-plugins/vite-plugin-reload-on-dynamically-injected-style-changes";
import viteTouchGlobalCss from "./vite-plugins/vite-plugin-touch-global-css";
import viteMoveHtmlPlugin from "./vite-plugins/vite-plugin-move-html";
import viteRemoveStaticCssFromManifest from "./vite-plugins/vite-plugin-remove-static-css-from-manifest";

export default defineConfig(() => ({
  base: "./",
  build: {
    target: ["chrome89", "edge89", "firefox109"],
    emptyOutDir: true,
    outDir: `dist/${APP_CONFIG.BROWSER}`,
    reportCompressedSize: false,
    rollupOptions: {
      output: {
        chunkFileNames: "assets/cplx-chunk-[hash].js",
        assetFileNames: "assets/cplx-assets-[hash][extname]",
        entryFileNames: "assets/cplx-entry-[name]-[hash].js",
      },
    },
  },
  plugins: [
    crx({
      manifest:
        APP_CONFIG.BROWSER === "chrome" ? chromeManifest : firefoxManifest,
      browser: APP_CONFIG.BROWSER,
    }),
    react(),
    tailwindcss(),
    Unimport.vite(unimportConfig),

    // dev
    viteTouchGlobalCss({
      cssFilePath: path.resolve(__dirname, "src/assets/index.css"),
      watchFiles: [
        path.resolve(__dirname, "src/"),
        path.resolve(__dirname, "public/"),
      ],
    }),
    vitePluginReloadOnDynamicallyInjectedStyleChanges({
      excludeString: ["@/assets/index.css", "@/assets/cs.css"],
    }),
    vitePluginForceRestartOnChanges({
      folders: ["public"],
    }),

    // build
    viteMoveHtmlPlugin([
      {
        src: "src/entrypoints/options-page/options.html",
        dest: "options.html",
      },
    ]),
    viteRemoveStaticCssFromManifest(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "~": path.resolve(__dirname, "./"),
    },
  },
  server: {
    port: 8811,
    hmr: {
      host: "localhost",
      protocol: "ws",
    },
    warmup: {
      clientFiles: [
        "src/entrypoints/content-scripts/index.ts",
        "src/entrypoints/options-page/options.html",
      ],
    },
  },
  test: {
    exclude: ["node_modules", "e2e/**"],
    setupFiles: ["./tests/vitest.setup.ts"],
  },
  legacy: {
    skipWebSocketTokenCheck: true,
  },
}));
