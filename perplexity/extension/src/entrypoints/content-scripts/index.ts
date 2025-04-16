import "@/utils/jquery.extensions";

import { allowWindowMessaging } from "webext-bridge/content-script";

import { APP_CONFIG } from "@/app.config";
import { executeCsPluginLoaders } from "@/entrypoints/content-scripts/loaders";
import { applyRouteIdAttrs } from "@/plugins/_core/main-world/spa-router/utils";
import { contentScriptGuard } from "@/utils/content-scripts-guard";
import { insertCss, waitForDocumentReady, whereAmI } from "@/utils/utils";

(async () => {
  allowWindowMessaging("com.complexity");

  await waitForDocumentReady();

  applyRouteIdAttrs(whereAmI());

  contentScriptGuard();

  if (!APP_CONFIG.IS_DEV)
    insertCss({
      id: "cs-ui-root",
      css: (await import("@/plugins/_core/ui/_root/CsUiRoot")).csUiRootCss,
    });

  executeCsPluginLoaders();
})();
