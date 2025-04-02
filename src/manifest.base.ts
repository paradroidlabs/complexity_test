/* eslint-disable @limegrass/import-alias/import-alias */
import { ManifestV3Export } from "@crxjs/vite-plugin";

import { APP_CONFIG } from "./app.config";
import packageData from ".././package.json";

export type PlainManifest = Exclude<
  Exclude<ManifestV3Export, Promise<any>>,
  (...args: any[]) => any
>;

export type ExtendedManifestV3Export = PlainManifest & {
  optional_host_permissions: string[];
};

export const baseManifest: ExtendedManifestV3Export = {
  manifest_version: 3,
  name: "__MSG_appName__",
  description: "__MSG_appDesc__",
  version: packageData.version,
  homepage_url: "https://cplx.app",
  default_locale: "en",

  icons: {
    16: "public/img/logo-16.png",
    32: "public/img/logo-34.png",
    48: "public/img/logo-48.png",
    128: "public/img/logo-128.png",
  },
  action: {
    default_icon: "public/img/logo-48.png",
  },
  options_ui: {
    open_in_tab: true,
    page: "src/entrypoints/options-page/options.html",
  },

  permissions: ["storage", "unlimitedStorage", "contextMenus"],
  optional_permissions: [],

  host_permissions: [
    ...APP_CONFIG["perplexity-ai"].globalMatches,
    ...(APP_CONFIG.IS_DEV ? ["http://localhost:8811/*"] : []),
  ],
  optional_host_permissions: [],

  content_scripts: [
    {
      matches: APP_CONFIG["perplexity-ai"].globalMatches,
      exclude_matches: APP_CONFIG["perplexity-ai"].globalExcludeMatches,
      js: ["src/entrypoints/content-scripts/index.ts"],
    },
  ],

  web_accessible_resources: [
    {
      resources: ["public/img/logo-*.png", "*.css"],
      matches: ["*://*/*"],
    },
  ],
};
