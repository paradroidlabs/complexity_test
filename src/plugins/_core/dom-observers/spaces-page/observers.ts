import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { spacesPageDomObserverStore } from "@/plugins/_core/dom-observers/spaces-page/store";
import { observeSpaceCard } from "@/plugins/_core/dom-observers/spaces-page/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/spa-router/listeners";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { whereAmI } from "@/utils/utils";

const cleanup = () => {
  DomObserver.destroy("spacesPage");
  spacesPageDomObserverStore.getState().resetStore();
};

csLoaderRegistry.register({
  id: "coreDomObserver:spacesPage",
  dependencies: ["messaging:spaRouter"],
  loader: () => {
    observeSpacesPage(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      observeSpacesPage(whereAmI(url));
    });
  },
});

function observeSpacesPage(location: ReturnType<typeof whereAmI>) {
  if (
    !shouldEnableCoreObserver({
      coreObserverId: "coreDomObserver:spacesPage",
    })
  )
    return;

  cleanup();

  if (location !== "collections_page") return;

  DomObserver.create("spacesPage", {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: observeSpaceCard,
          id: "spacesPage:spaceCard",
        },
      ]),
  });
}
