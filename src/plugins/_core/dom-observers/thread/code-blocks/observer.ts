import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { threadCodeBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/code-blocks/store";
import { findCodeBlocks } from "@/plugins/_core/dom-observers/thread/code-blocks/utils";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "coreDomObserver:thread:codeBlocks",
  dependencies: ["coreDomObserver:thread:messageBlocks"],
  loader: () => {
    if (
      !shouldEnableCoreObserver({
        coreObserverId: "coreDomObserver:thread:codeBlocks",
      })
    )
      return;

    observeThreadCodeBlocks();
  },
});

function observeThreadCodeBlocks() {
  threadMessageBlocksDomObserverStore.subscribe(
    (store) => store.messageBlocks,
    async (messageBlocks) => {
      if (messageBlocks == null) {
        threadCodeBlocksDomObserverStore.getState().resetStore();
        return;
      }

      CallbackQueue.getInstance().enqueueArray([
        {
          id: "thread:codeBlocks",
          callback: async () => {
            threadCodeBlocksDomObserverStore.setState({
              codeBlocksChunks: await findCodeBlocks(messageBlocks),
            });
          },
        },
      ]);
    },
    {
      equalityFn: deepEqual,
    },
  );
}
