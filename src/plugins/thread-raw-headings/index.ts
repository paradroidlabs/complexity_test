import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/spa-router/listeners";
import styles from "@/plugins/thread-raw-headings/styles.css?inline";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { insertCss, whereAmI } from "@/utils/utils";

let cleanup: () => void | null;

csLoaderRegistry.register({
  id: "plugin:thread:rawHeadings",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["thread:rawHeadings"]) return;

    rawHeadings(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      rawHeadings(whereAmI(url));
    });
  },
});

function rawHeadings(location: ReturnType<typeof whereAmI>) {
  cleanup?.();

  if (location !== "thread") return;

  const removeCss = insertCss({
    css: styles,
    id: "raw-headings",
  });

  cleanup = () => removeCss();
}
