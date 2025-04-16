import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";
import { parseCookies } from "@/plugins/_core/global-stores/pplx-cookies-store";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "store:pplxCookies": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "store:pplxCookies",
    dependencies: ["cache:extensionSettings"],
    loader: () => {
      parseCookies();

      DomObserver.create(createDomObserverId("misc", "pplxCookies"), {
        target: document.body,
        config: { childList: true, subtree: true },
        onMutation: parseCookies,
      });
    },
  });
}
