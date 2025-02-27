import { sendMessage } from "webext-bridge/content-script";

import { usePplxCookiesStore } from "@/data/pplx-cookies-store";
import { useQueryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { PluginsStatesService } from "@/services/plugins-states";

export function useForceSyncActiveNativeModelSelector() {
  const cookies = usePplxCookiesStore((store) => store.cookies);

  const $activeModelSelector = useQueryBoxesDomObserverStore(
    (store) => store.activeModelSelector,
    deepEqual,
  );

  useEffect(() => {
    if (
      !PluginsStatesService.getEnableStatesCachedSync()[
        "queryBox:languageModelSelector"
      ]
    )
      return;

    if (!$activeModelSelector || !$activeModelSelector.length) return;

    const searchMode = cookies.find(
      (cookie) => cookie.name === "pplx.search-mode",
    )?.value;

    if (!searchMode) return;

    sendMessage("reactVdom:syncNativeModelSelector", { searchMode }, "window");
  }, [$activeModelSelector, cookies]);
}
