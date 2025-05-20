import { defineProxyService } from "@webext-core/proxy-service";

import { APP_CONFIG } from "@/app.config";
import { InstantCssService } from "@/services/instant-css";
import { instantCssCoordinator } from "@/services/instant-css/coordinator";
import { InstantCssStorage } from "@/services/instant-css/storage.proxy-service";
import type {
  InstantCss,
  InstantCssSettings,
} from "@/services/instant-css/types";
import { isValidPplxPage } from "@/services/instant-css/utils";
import { invariant, isBackgroundScript } from "@/utils/utils";

export class InstantCssInjector {
  private static injector = async (
    details: chrome.webNavigation.WebNavigationFramedCallbackDetails,
  ) => {
    if (details.frameId !== 0) return;

    const tab = await chrome.tabs.get(details.tabId);

    if (!tab.url) return;

    if (!isValidPplxPage(tab.url)) return;

    instantCssCoordinator.resetTab(details.tabId);

    await instantCssCoordinator.forceCleanup().catch((error) => {
      console.error("Failed to clean up tabs during injection:", error);
    });

    try {
      const settings = await InstantCssStorage.get();

      for (const [id, { css, removeAfter, enabled }] of Object.entries(
        settings,
      )) {
        InstantCssInjector.injectCss({
          id: id as keyof InstantCssSettings,
          tabId: details.tabId,
          css,
          removeAfter,
          enabled,
        });
      }
    } catch (error) {
      console.error("Failed to apply instant css:", error);
    }
  };

  private static tabRemovedHandler = (tabId: number) => {
    instantCssCoordinator.removeTab(tabId);
  };

  static async injectCss(
    params: InstantCss & { id: keyof InstantCssSettings; tabId: number },
  ) {
    await instantCssCoordinator.injectCss(params);
  }

  static async removeCss(params: InstantCss & { tabId: number }) {
    await instantCssCoordinator.removeCss(params);
  }

  static async registerListeners() {
    invariant(
      isBackgroundScript(),
      "This method is not allowed in content script",
    );

    InstantCssInjector.removeListeners();

    if (!(await InstantCssService.hasPermissions())) return;

    chrome.webNavigation.onCommitted.addListener(InstantCssInjector.injector, {
      url: APP_CONFIG["perplexity-ai"].globalMatches.map((match) => ({
        urlMatches: match,
      })),
    });

    chrome.tabs.onRemoved.addListener(InstantCssInjector.tabRemovedHandler);
  }

  static async removeListeners() {
    invariant(
      isBackgroundScript(),
      "This method is not allowed in content script",
    );

    if (!(await InstantCssService.hasPermissions())) return;

    chrome.webNavigation.onCommitted.removeListener(
      InstantCssInjector.injector,
    );

    chrome.tabs.onRemoved.removeListener(InstantCssInjector.tabRemovedHandler);
  }
}

export const [registerService, getInstantCssInjectorService] =
  defineProxyService("InstantCssInjector", () => InstantCssInjector);
