import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import styles from "@/plugins/thread-raw-headings/styles.css?inline";
import { insertCss, whereAmI } from "@/utils/utils";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:thread:rawHeadings": void;
  }
}

let cleanup: () => void | null;

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:thread:rawHeadings",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["thread:rawHeadings"]) return;

      rawHeadings(whereAmI());

      spaRouteChangeCompleteSubscribe((url) => {
        rawHeadings(whereAmI(url));
      });
    },
  });
}

function rawHeadings(location: ReturnType<typeof whereAmI>) {
  cleanup?.();

  if (location !== "thread") return;

  const removeCss = insertCss({
    css: styles,
    id: "raw-headings",
  });

  cleanup = () => removeCss();
}
