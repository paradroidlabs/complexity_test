import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import {
  CallbackQueue,
  createTaskId,
} from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { findMessageBlocks } from "@/plugins/_core/dom-observers/thread/message-blocks/utils";
import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";

declare module "@/plugins/_core/dom-observers/types" {
  interface CoreDomObserverRegistry {
    "thread:messageBlocks": void;
  }
}

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "coreDomObserver:thread:messageBlocks": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "coreDomObserver:thread:messageBlocks",
    dependencies: ["cache:pluginsStates"],
    loader: () => {
      if (
        !shouldEnableCoreObserver({
          coreObserverId: "thread:messageBlocks",
        })
      )
        return;

      observeThreadMessageBlocks();
    },
  });
}
function cleanup() {
  DomObserver.destroy(createDomObserverId("thread", "messageBlocks"));
  threadMessageBlocksDomObserverStore.getState().resetStore();
}

function observeThreadMessageBlocks() {
  threadDomObserverStore.subscribe(
    (store) => store.$wrapper,
    ($threadWrapper) => {
      cleanup();

      if ($threadWrapper == null || !$threadWrapper[0]) return;

      DomObserver.create(createDomObserverId("thread", "messageBlocks"), {
        target: $threadWrapper[0],
        config: { childList: true, subtree: true },
        fireImmediately: true,
        onMutation,
      });
    },
    {
      equalityFn: deepEqual,
    },
  );
}

async function onMutation() {
  const messageBlocks = await findMessageBlocks();

  if (messageBlocks == null) return;

  const isAnyMessageBlockInFlight = messageBlocks.some(
    (block) => block.states.isInFlight,
  );

  // in case the in-flight message is virtualized, no further DOM mutations will occur so we need to force trigger the observer
  if (isAnyMessageBlockInFlight) {
    setTimeout(() => {
      DomObserver.forceTrigger(createDomObserverId("thread", "messageBlocks"));
    }, 100);
  }

  threadDomObserverStore.setState((store) => {
    store.states.isInFlight = isAnyMessageBlockInFlight;
  });

  CallbackQueue.getInstance().enqueue(
    async () => {
      threadMessageBlocksDomObserverStore.setState({
        messageBlocks,
      });
    },
    createTaskId("thread", "messageBlocks"),
  );
}
