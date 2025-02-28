import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

csLoaderRegistry.register({
  id: "plugin:thread:dynamicQueryFontSize",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    if (
      !PluginsStatesService.getEnableStatesCachedSync()[
        "thread:betterMessageToolbars"
      ] ||
      !ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:betterMessageToolbars"
      ].dynamicQueryFontSize
    )
      return;

    threadMessageBlocksDomObserverStore.subscribe(
      (store) => store.messageBlocks,
      (messageBlocks) => {
        messageBlocks?.forEach((messageBlock) => {
          const title = messageBlock.content.title;
          const queryCharactersCount = title.length;

          if (queryCharactersCount > 200) {
            messageBlock.nodes.$query
              .find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY)
              .addClass("x-text-lg !x-font-medium");
          } else if (queryCharactersCount > 100) {
            messageBlock.nodes.$query
              .find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY)
              .addClass("x-text-xl !x-font-medium");
          }
        });
      },
      {
        equalityFn: deepEqual,
      },
    );
  },
});
