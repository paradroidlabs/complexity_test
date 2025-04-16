import semver from "semver";
import { onMessage } from "webext-bridge/background";

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
      semver.lt(semver.coerce(previousVersion)!, "1.0.0")
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

  onMessage("bg:openDirectReleaseNotes", ({ data: { version } }) => {
    const optionsPageUrl = getOptionsPageUrl();

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
