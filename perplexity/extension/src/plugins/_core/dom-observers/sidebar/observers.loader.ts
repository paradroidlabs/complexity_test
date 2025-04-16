import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import {
  findLibraryButtonTriggerButtonsWrapper,
  findLibraryButtonWrapper,
  findSidebarWrapper,
  findSpaceButtonTriggerButtonsWrapper,
  findSpaceButtonWrapper,
} from "@/plugins/_core/dom-observers/sidebar/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    sidebar: void;
  }
}

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:sidebar": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:sidebar",
    dependencies: ["cache:pluginsStates"],
    loader: () => {
      if (
        !shouldEnableCoreObserver({
          coreObserverId: "sidebar",
        })
      )
        return;

      observeSidebar();
    },
  });
}

async function observeSidebar() {
  DomObserver.create(createDomObserverId("sidebar", "wrapper"), {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: findSidebarWrapper,
          id: createTaskId("sidebar", "wrapper"),
        },
        {
          callback: findSpaceButtonWrapper,
          id: createTaskId("sidebar", "spaceButtonWrapper"),
        },
        {
          callback: findSpaceButtonTriggerButtonsWrapper,
          id: createTaskId("sidebar", "spaceButtonTriggerButtonsWrapper"),
        },
        {
          callback: findLibraryButtonWrapper,
          id: createTaskId("sidebar", "libraryButtonWrapper"),
        },
        {
          callback: findLibraryButtonTriggerButtonsWrapper,
          id: createTaskId("sidebar", "libraryButtonTriggerButtonsWrapper"),
        },
      ]),
  });
}
