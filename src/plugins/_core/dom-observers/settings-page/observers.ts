import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { settingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { findTopNavWrapper } from "@/plugins/_core/dom-observers/settings-page/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/spa-router/listeners";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { whereAmI } from "@/utils/utils";

const cleanup = () => {
  DomObserver.destroy("settingsPage:topNavWrapper");
  settingsPageDomObserverStore.getState().resetStore();
};

csLoaderRegistry.register({
  id: "coreDomObserver:settingsPage",
  loader: () => {
    observeSettingsPage(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      observeSettingsPage(whereAmI(url));
    });
  },
});

async function observeSettingsPage(location: ReturnType<typeof whereAmI>) {
  if (location !== "settings") return cleanup();

  DomObserver.create("settingsPage:topNavWrapper", {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: findTopNavWrapper,
          id: "settingsPage:topNavWrapper",
        },
      ]),
  });
}
