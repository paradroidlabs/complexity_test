import "@/utils/jquery.extensions";
import "@/entrypoints/content-scripts/loaders/loaders";

import { APP_CONFIG } from "@/app.config";
import { showInitializingIndicator } from "@/components/loading-indicator";
import { csUiRootCss } from "@/entrypoints/content-scripts/loaders/cs-ui-plugins-loader/CsUiRoot";
import { contentScriptGuard } from "@/utils/content-scripts-guard";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { insertCss, waitForDocumentReady } from "@/utils/utils";

(async () => {
  await waitForDocumentReady();

  if (!APP_CONFIG.IS_DEV)
    insertCss({
      css: csUiRootCss,
      id: "cs-ui-root",
    });
  showInitializingIndicator();
  contentScriptGuard();
  csLoaderRegistry.executeAll();
})();
