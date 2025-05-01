import { onMessage } from "webext-bridge/background";

import { APP_CONFIG } from "@/app.config";
import { ExtensionSettingsService } from "@/services/extension-settings";
import { getOptionsPageUrl } from "@/utils/utils";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "bg:getTabId": () => number;
    "bg:openDirectReleaseNotes": ({ version }: { version: string }) => void;
    "bg:openOptionsPage": () => void;
  }
}

export function setupBackgroundListeners() {
  extensionIconActionListener();

  onboardingFlowTrigger();

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
      chrome.tabs.create({
        url: getOptionsPageUrl({ isDev: APP_CONFIG.IS_DEV }),
      });
    }
  });
}

function onboardingFlowTrigger() {
  chrome.runtime.onInstalled.addListener(({ reason }) => {
    if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
      chrome.tabs.create({
        url: `${getOptionsPageUrl({ isDev: APP_CONFIG.IS_DEV })}#/onboarding`,
      });
    }
  });
}

function contentScriptListeners() {
  onMessage("bg:getTabId", ({ sender }) => sender.tabId);

  onMessage("bg:openOptionsPage", () => {
    chrome.runtime.openOptionsPage();
  });

  onMessage("bg:openDirectReleaseNotes", ({ data: { version } }) => {
    const optionsPageUrl = getOptionsPageUrl({ isDev: APP_CONFIG.IS_DEV });

    chrome.tabs.create({
      url: `${optionsPageUrl}#/direct-release-notes?version=${version}`,
    });
  });
}

function extensionIconActionListener() {
  chrome.action.onClicked.addListener(async () => {
    const action = (await ExtensionSettingsService.get()).extensionIconAction;

    if (action === "perplexity")
      chrome.tabs.create({ url: "https://perplexity.ai/" });
    else chrome.runtime.openOptionsPage();
  });
}
