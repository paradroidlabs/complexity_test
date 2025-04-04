import { produce } from "immer";
import { onMessage } from "webext-bridge/background";

import { APP_CONFIG } from "@/app.config";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { ExtensionLocalStorageApi } from "@/services/extension-local-storage/extension-local-storage-api";
import { hasRequiredPermissions } from "@/services/pplx-theme-preloader";
import { ExtensionVersion } from "@/utils/ext-version";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { getOptionsPageUrl } from "@/utils/utils";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "bg:getTabId": () => number;
    "bg:removePreloadedTheme": () => void;
    "bg:openDirectReleaseNotes": ({ version }: { version: string }) => void;
    "bg:openOptionsPage": () => void;
  }
}

export function setupBackgroundListeners() {
  extensionIconActionListener();

  onboardingFlowTrigger();

  invalidateCdnCache();

  createDashboardShortcut();

  contentScriptListeners();
}

function createDashboardShortcut() {
  chrome.contextMenus.removeAll();

  chrome.contextMenus.create({
    id: "openOptionsPage",
    title: "Dashboard",
    contexts: ["action"],
  });

  chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "openOptionsPage") {
      chrome.tabs.create({ url: getOptionsPageUrl() });
    }
  });
}

function onboardingFlowTrigger() {
  chrome.runtime.onInstalled.addListener(({ reason, previousVersion }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({
        url: `${getOptionsPageUrl()}#/onboarding`,
      });
    } else if (
      reason === chrome.runtime.OnInstalledReason.UPDATE &&
      previousVersion &&
      new ExtensionVersion("1.0.0.0").isNewerThan(previousVersion)
    ) {
      chrome.tabs.create({
        url: `${getOptionsPageUrl()}#/onboarding?fromAlpha=true`,
      });
    }
  });
}

function contentScriptListeners() {
  onMessage("bg:getTabId", ({ sender }) => sender.tabId);

  onMessage("bg:openOptionsPage", () => {
    chrome.runtime.openOptionsPage();
  });

  onMessage("bg:removePreloadedTheme", async ({ sender }) => {
    if (!(await hasRequiredPermissions())) return;

    const chosenThemeId = (await ExtensionLocalStorageService.get()).theme;
    const css = await getThemeCss(chosenThemeId);

    if (!css) return;

    chrome.scripting.removeCSS({
      target: { tabId: sender.tabId },
      css,
    });
  });

  onMessage("bg:openDirectReleaseNotes", ({ data: { version } }) => {
    const optionsPageUrl = getOptionsPageUrl();

    chrome.tabs.create({
      url: `${optionsPageUrl}#/direct-release-notes?version=${version}`,
    });
  });
}

function invalidateCdnCache() {
  chrome.runtime.onInstalled.addListener(
    async ({ reason, previousVersion }) => {
      if (reason !== chrome.runtime.OnInstalledReason.UPDATE) return;

      const oldRawSettings = await ExtensionLocalStorageService.get();

      ExtensionLocalStorageApi.set(
        produce(oldRawSettings, (draft) => {
          draft.cdnLastUpdated = Date.now();
        }),
      );

      if (
        previousVersion &&
        new ExtensionVersion(APP_CONFIG.VERSION).isNewerThan(previousVersion)
      ) {
        ExtensionLocalStorageApi.set(
          produce(oldRawSettings, (draft) => {
            draft.isPostUpdateReleaseNotesPopupDismissed = false;
          }),
        );
      }
    },
  );
}

function extensionIconActionListener() {
  chrome.action.onClicked.addListener(async () => {
    const action = (await ExtensionLocalStorageService.get())
      .extensionIconAction;

    if (action === "perplexity")
      chrome.tabs.create({ url: "https://perplexity.ai/" });
    else chrome.runtime.openOptionsPage();
  });
}
