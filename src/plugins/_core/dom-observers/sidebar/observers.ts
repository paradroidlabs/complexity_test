import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { sidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import {
  findLibraryButtonTriggerButtonsWrapper,
  findLibraryButtonWrapper,
  findSidebarWrapper,
  findSpaceButtonTriggerButtonsWrapper,
  findSpaceButtonWrapper,
} from "@/plugins/_core/dom-observers/sidebar/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "coreDomObserver:sidebar",
  loader: () => {
    if (
      !shouldEnableCoreObserver({
        coreObserverId: "coreDomObserver:sidebar",
      })
    )
      return;

    observeSidebar();
  },
});

async function observeSidebar() {
  DomObserver.create("sidebar:wrapper", {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        {
          callback: findSidebarWrapper,
          id: "sidebar:wrapper",
        },
        {
          callback: findSpaceButtonWrapper,
          id: "sidebar:spaceButtonWrapper",
        },
        {
          callback: findSpaceButtonTriggerButtonsWrapper,
          id: "sidebar:spaceButtonTriggerButtonsWrapper",
        },
        {
          callback: findLibraryButtonWrapper,
          id: "sidebar:libraryButtonWrapper",
        },
        {
          callback: findLibraryButtonTriggerButtonsWrapper,
          id: "sidebar:libraryButtonTriggerButtonsWrapper",
        },
      ]),
  });

  sidebarDomObserverStore.subscribe(
    (store) => store.$wrapper,
    ($wrapper) => {
      DomObserver.destroy("sidebar:wrapper:openState");

      if ($wrapper == null) return;

      DomObserver.create("sidebar:wrapper:openState", {
        target: $wrapper[0],
        config: {
          childList: false,
          subtree: false,
          attributes: true,
          attributeFilter: ["data-state"],
        },
        onMutation: () => {
          setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
          }, 300);
        },
      });
    },
    {
      equalityFn: deepEqual,
    },
  );
}
