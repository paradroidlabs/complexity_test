import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { colorSchemeStore } from "@/plugins/_core/global-stores/color-scheme-store";
import { getCookie } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "store:colorScheme": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "store:colorScheme",
    dependencies: ["cache:extensionSettings"],
    loader: () => {
      const currentColorScheme = getCookie("colorScheme");
      $("html").attr("data-color-scheme", currentColorScheme);

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
