import { createElement } from "react";
import { createRoot } from "react-dom/client";
import { sendMessage } from "webext-bridge/content-script";

import { APP_CONFIG } from "@/app.config";
import { WarningDialog } from "@/components/ExtensionContextInvalidationWatchdog";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

export function contentScriptGuard(): boolean {
  const removePreloadedTheme = async () => {
    if ((await ExtensionLocalStorageService.get()).preloadTheme)
      sendMessage("bg:removePreloadedTheme", undefined, "background");
  };

  const shouldProceed =
    ignoreInvalidPages() && checkForExistingExtensionInstance();

  if (!shouldProceed) {
    removePreloadedTheme();
    return false;
  }

  return true;
}

function ignoreInvalidPages() {
  const isCloudflareVerificationPage = $(document.body).hasClass("no-js");

  if (isCloudflareVerificationPage) {
    console.error("Cloudflare verification page");
    return false;
  }

  return true;
}

function checkForExistingExtensionInstance() {
  if ($(document.body).attr("data-cplx-injected")) {
    if (APP_CONFIG.BROWSER === "firefox") {
      const $root = $("<div>")
        .attr("id", "complexity-root-temp")
        .appendTo(document.body);
      if ($root[0] == null) return;
      const root = createRoot($root[0]);
      root.render(createElement(WarningDialog));
    }

    return false;
  }

  $(document.body).attr("data-cplx-injected", "true");

  return true;
}
