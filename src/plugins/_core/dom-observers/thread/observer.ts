import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_api/spa-router/listeners";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import {
  findOverflowMenuButtonWrapper,
  findNavbar,
  findPopper,
  findWrapper,
} from "@/plugins/_core/dom-observers/thread/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { whereAmI } from "@/utils/utils";

csLoaderRegistry.register({
  id: "coreDomObserver:thread",
  dependencies: ["messaging:spaRouter"],
  loader: () => {
    if (
      !shouldEnableCoreObserver({
        coreObserverId: "coreDomObserver:thread",
      })
    )
      return;

    observeThread(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      observeThread(whereAmI(url));
    });
  },
});

function cleanup() {
  DomObserver.destroy("thread");
  threadDomObserverStore.getState().resetStore();
}

function observeThread(location: ReturnType<typeof whereAmI>) {
  if (location !== "thread") return cleanup();

  DomObserver.create("thread", {
    target: document.body,
    config: { childList: true, subtree: true },
    fireImmediately: true,
    onMutation: () => {
      CallbackQueue.getInstance().enqueueArray([
        {
          id: "thread:wrapper",
          callback: findWrapper,
        },
        {
          id: "thread:navbar",
          callback: findNavbar,
        },
        {
          id: "thread:popper",
          callback: findPopper,
        },
        {
          id: "thread:navbar:bookmarkButton",
          callback: findOverflowMenuButtonWrapper,
        },
      ]);
    },
  });
}
