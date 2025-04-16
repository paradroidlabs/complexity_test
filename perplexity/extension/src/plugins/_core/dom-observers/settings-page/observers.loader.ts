import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { settingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { findSidebar } from "@/plugins/_core/dom-observers/settings-page/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import { whereAmI } from "@/utils/utils";

const cleanup = () => {
  DomObserver.destroy(createDomObserverId("settingsPage", "topNavWrapper"));
  settingsPageDomObserverStore.getState().resetStore();
};

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    settingsPage: void;
  }
}

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:settingsPage": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:settingsPage",
    dependencies: ["cache:pluginsStates"],
    loader: () => {
      observeSettingsPage(whereAmI());

      spaRouteChangeCompleteSubscribe((url) => {
        observeSettingsPage(whereAmI(url));
      });
    },
  });
}

async function observeSettingsPage(location: ReturnType<typeof whereAmI>) {
  if (location !== "settings") return cleanup();

  DomObserver.create(createDomObserverId("settingsPage", "topNavWrapper"), {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: findSidebar,
          id: createTaskId("settingsPage", "topNavWrapper"),
        },
      ]),
  });
}
