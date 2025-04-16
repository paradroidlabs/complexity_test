import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { colorSchemeStore } from "@/plugins/_core/global-stores/color-scheme-store";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "store:colorScheme": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "store:colorScheme",
    dependencies: ["cache:extensionSettings"],
    loader: () => {
      DomObserver.create(createDomObserverId("misc", "colorScheme"), {
        target: $("html")[0]!,
        config: {
          subtree: false,
          childList: false,
          attributes: true,
          attributeFilter: ["data-color-scheme"],
        },
        onMutation: () => {
          colorSchemeStore.setState((state) => {
            state.colorScheme =
              $("html").attr("data-color-scheme") === "dark" ? "dark" : "light";
          });
        },
      });
    },
  });
}
