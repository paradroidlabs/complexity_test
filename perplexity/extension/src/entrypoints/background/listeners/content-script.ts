import { onMessage } from "webext-bridge/background";

import { APP_CONFIG } from "@/app.config";
import { getOptionsPageUrl } from "@/utils/utils";

export function contentScriptListeners() {
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
