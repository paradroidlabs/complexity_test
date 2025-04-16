import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import type { QueryBoxesDomObserverStoreType } from "@/plugins/_core/dom-observers/query-boxes/store";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";

const OBSERVER_ID = "submit-on-ctrl-enter";

function submitOnCtrlEnter(queryBoxes: QueryBoxesDomObserverStoreType["main"]) {
  Object.values(queryBoxes).forEach(($queryBox) => {
    if (!$queryBox || !$queryBox.length) return;

    const $textarea = $queryBox.find("textarea");

    if (!$textarea.length) return;

    if (!$textarea.length || $textarea.attr(OBSERVER_ID)) return;

    $textarea.attr(OBSERVER_ID, "true");

    $textarea.on("keydown", (e) => {
      if (e.key === "Enter") {
        if (e.ctrlKey || e.metaKey) return;
        e.stopPropagation();
      }
    });
  });
}

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:submitOnCtrlEnter": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:submitOnCtrlEnter",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["queryBox:submitOnCtrlEnter"]) return;

      queryBoxesDomObserverStore.subscribe(
        (store) => ({
          main: store.main,
          followUp: store.followUp,
        }),
        ({ main, followUp }) => {
          submitOnCtrlEnter({
            ...main,
            ...followUp,
          });
        },
      );
    },
  });
}
