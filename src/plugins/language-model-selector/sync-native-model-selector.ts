import { sendMessage } from "webext-bridge/content-script";

import { pplxCookiesStore } from "@/data/pplx-cookies-store";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

const cleanup = () => {
  DomObserver.destroy(
    "plugin:queryBox:languageModelSelector:syncNativeModelSelector",
  );
};

csLoaderRegistry.register({
  id: "plugin:queryBox:languageModelSelector:syncNativeModelSelector",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["queryBox:languageModelSelector"]) return;

    queryBoxesDomObserverStore.subscribe(
      (store) => store.$pplxComponentsWrapper,
      ($pplxComponentsWrapper) => {
        cleanup?.();

        if (!$pplxComponentsWrapper || !$pplxComponentsWrapper.length) return;

        DomObserver.create(
          "plugin:queryBox:languageModelSelector:syncNativeModelSelector",
          {
            target: $pplxComponentsWrapper[0],
            config: { childList: true, subtree: true },
            onMutation: () => syncNativeModelSelector(),
          },
        );
      },
      {
        equalityFn: deepEqual,
      },
    );
  },
});

function syncNativeModelSelector() {
  const cookies = pplxCookiesStore.getState().cookies;

  const searchMode = cookies.find(
    (cookie) => cookie.name === "pplx.search-mode-raw",
  )?.value;

  if (!searchMode) return;

  sendMessage("reactVdom:syncNativeModelSelector", { searchMode }, "window");
}
