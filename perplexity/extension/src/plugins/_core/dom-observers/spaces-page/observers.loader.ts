import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { spacesPageDomObserverStore } from "@/plugins/_core/dom-observers/spaces-page/store";
import { observeSpaceCard } from "@/plugins/_core/dom-observers/spaces-page/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import { whereAmI } from "@/utils/utils";

const cleanup = () => {
  DomObserver.destroy(createDomObserverId("spacesPage"));
  spacesPageDomObserverStore.getState().resetStore();
};

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    spacesPage: void;
  }
}

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:spacesPage": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:spacesPage",
    dependencies: ["messaging:spaRouter", "cache:pluginsStates"],
    loader: () => {
      observeSpacesPage(whereAmI());

      spaRouteChangeCompleteSubscribe((url) => {
        observeSpacesPage(whereAmI(url));
      });
    },
  });
}

function observeSpacesPage(location: ReturnType<typeof whereAmI>) {
  if (
    !shouldEnableCoreObserver({
      coreObserverId: "spacesPage",
    })
  )
    return;

  cleanup();

  if (location !== "collections_page") return;

  DomObserver.create(createDomObserverId("spacesPage"), {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: observeSpaceCard,
          id: createTaskId("spacesPage", "spaceCard"),
        },
      ]),
  });
}
