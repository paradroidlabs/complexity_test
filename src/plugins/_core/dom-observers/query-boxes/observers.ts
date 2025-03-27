import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import {
  findPplxComponentsWrapper,
  findFollowUpQueryBox,
  findMainModalQueryBox,
  findMainQueryBox,
  findSpaceQueryBox,
} from "@/plugins/_core/dom-observers/query-boxes/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/spa-router/listeners";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { whereAmI } from "@/utils/utils";

const cleanup = () => {
  DomObserver.destroy("queryBoxes:home");
  DomObserver.destroy("queryBoxes:collection");
  DomObserver.destroy("queryBoxes:followUp");
  DomObserver.destroy("queryBoxes:modal");
  DomObserver.destroy("queryBoxes:pplxComponentsWrapper");
};

csLoaderRegistry.register({
  id: "coreDomObserver:queryBoxes",
  dependencies: ["cache:extensionLocalStorage", "messaging:spaRouter"],
  loader: () => {
    if (
      !shouldEnableCoreObserver({
        coreObserverId: "coreDomObserver:queryBoxes",
      })
    )
      return;

    observeQueryBoxes(whereAmI());
    spaRouteChangeCompleteSubscribe((url) => {
      observeQueryBoxes(whereAmI(url));
    });
  },
});

async function observeQueryBoxes(location: ReturnType<typeof whereAmI>) {
  if (
    !shouldEnableCoreObserver({
      coreObserverId: "coreDomObserver:queryBoxes",
    })
  )
    return;

  cleanup();

  if (location === "home") {
    queryBoxesDomObserverStore.getState().setMainNodes({
      $spaceQueryBox: null,
    });

    queryBoxesDomObserverStore.setState({
      followUp: {
        $followUpQueryBox: null,
      },
    });

    DomObserver.create("queryBoxes:home", {
      target: document.body,
      config: { childList: true, subtree: true },
      fireImmediately: true,
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          findMainQueryBox,
          "queryBoxes:home",
        ),
    });
  }

  if (location === "collection") {
    queryBoxesDomObserverStore.getState().setMainNodes({
      $mainQueryBox: null,
    });

    queryBoxesDomObserverStore.setState({
      followUp: {
        $followUpQueryBox: null,
      },
    });

    DomObserver.create("queryBoxes:collection", {
      target: document.body,
      config: { childList: true, subtree: true },
      fireImmediately: true,
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          findSpaceQueryBox,
          "queryBoxes:collection",
        ),
    });
  }

  if (location === "thread") {
    queryBoxesDomObserverStore.getState().setMainNodes({
      $mainQueryBox: null,
      $spaceQueryBox: null,
    });

    DomObserver.create("queryBoxes:followUp", {
      target: document.body,
      config: { childList: true, subtree: true },
      debounceTime: 500,
      fireImmediately: true,
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          findFollowUpQueryBox,
          "queryBoxes:followUp",
        ),
    });
  }

  DomObserver.create("queryBoxes:modal", {
    target: document.body,
    config: { childList: true, subtree: true },
    debounceTime: 500,
    fireImmediately: true,
    onMutation: () =>
      CallbackQueue.getInstance().enqueue(
        findMainModalQueryBox,
        "queryBoxes:modal",
      ),
  });

  DomObserver.create("queryBoxes:pplxComponentsWrapper", {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueue(
        findPplxComponentsWrapper,
        "queryBoxes:pplxComponentsWrapper",
      ),
  });
}
