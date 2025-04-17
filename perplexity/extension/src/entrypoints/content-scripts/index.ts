import "@/utils/jquery.extensions";

import { executeCsPluginLoaders } from "@/entrypoints/content-scripts/loaders";
import { applyRouteIdAttrs } from "@/plugins/_core/main-world/spa-router/utils";
import { contentScriptGuard } from "@/utils/content-scripts-guard";
import { waitForDocumentReady, whereAmI } from "@/utils/utils";

(async () => {
  await waitForDocumentReady();

  applyRouteIdAttrs(whereAmI());

  contentScriptGuard();

  executeCsPluginLoaders();
})();
