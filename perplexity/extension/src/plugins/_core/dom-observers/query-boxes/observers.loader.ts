import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import {
  findFollowUpQueryBox,
  findMainQueryBox,
  findSpaceQueryBox,
} from "@/plugins/_core/dom-observers/query-boxes/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import { whereAmI } from "@/utils/utils";

const cleanup = () => {
  DomObserver.destroy(createDomObserverId("queryBoxes", "home"));
  DomObserver.destroy(createDomObserverId("queryBoxes", "collection"));
  DomObserver.destroy(createDomObserverId("queryBoxes", "followUp"));
  DomObserver.destroy(
    createDomObserverId("queryBoxes", "pplxComponentsWrapper"),
  );
};

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    queryBoxes: void;
  }
}

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:queryBoxes": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:queryBoxes",
    dependencies: ["cache:pluginsStates", "messaging:spaRouter"],
    loader: () => {
      if (
        !shouldEnableCoreObserver({
          coreObserverId: "queryBoxes",
        })
      )
        return;

      observeQueryBoxes(whereAmI());
      spaRouteChangeCompleteSubscribe((url) => {
        observeQueryBoxes(whereAmI(url));
      });
    },
  });
}

async function observeQueryBoxes(location: ReturnType<typeof whereAmI>) {
  if (
    !shouldEnableCoreObserver({
      coreObserverId: "queryBoxes",
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

    DomObserver.create(createDomObserverId("queryBoxes", "home"), {
      target: document.body,
      config: { childList: true, subtree: true },
      fireImmediately: true,
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          findMainQueryBox,
          createTaskId("queryBoxes", "home"),
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

    DomObserver.create(createDomObserverId("queryBoxes", "collection"), {
      target: document.body,
      config: { childList: true, subtree: true },
      fireImmediately: true,
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          findSpaceQueryBox,
          createTaskId("queryBoxes", "collection"),
        ),
    });
  }

  if (location === "thread") {
    queryBoxesDomObserverStore.getState().setMainNodes({
      $mainQueryBox: null,
      $spaceQueryBox: null,
    });

    DomObserver.create(createDomObserverId("queryBoxes", "followUp"), {
      target: document.body,
      config: { childList: true, subtree: true },
      debounceTime: 500,
      fireImmediately: true,
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          findFollowUpQueryBox,
          createTaskId("queryBoxes", "followUp"),
        ),
    });
  }
}
