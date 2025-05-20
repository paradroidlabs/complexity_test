import { isHotkeyPressed } from "react-hotkeys-hook";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import type { QueryBoxesDomObserverStoreType } from "@/plugins/_core/dom-observers/query-boxes/store";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { ExtensionSettingsService } from "@/services/extension-settings";

const OBSERVER_ID = "raw-text-paste";

function rawTextPaste(queryBoxes: QueryBoxesDomObserverStoreType["main"]) {
  const settings =
    ExtensionSettingsService.cachedSync.plugins["queryBox:rawTextPaste"];

  Object.values(queryBoxes).forEach(($queryBox) => {
    if ($queryBox == null || !$queryBox.length) return;

    const $textarea = $queryBox.find("textarea");

    if (!$textarea.length || $textarea.attr(OBSERVER_ID)) return;

    $textarea.attr(OBSERVER_ID, "true");

    $textarea.on("paste", (e) => {
      const clipboardEvent = e.originalEvent as ClipboardEvent;

      if (
        clipboardEvent.clipboardData &&
        (settings.alwaysActive ||
          (!settings.alwaysActive && isHotkeyPressed(Key.Shift)))
      ) {
        if (clipboardEvent.clipboardData.types.includes("text/plain")) {
          e.stopImmediatePropagation();
        }
      }
    });
  });
}

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:rawTextPaste": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:rawTextPaste",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["queryBox:rawTextPaste"]) return;

      queryBoxesDomObserverStore.subscribe(
        (store) => ({
          main: store.main,
          followUp: store.followUp,
        }),
        ({ main, followUp }) => {
          rawTextPaste({
            ...main,
            ...followUp,
          });
        },
        {
          equalityFn: deepEqual,
        },
      );
    },
  });
}
