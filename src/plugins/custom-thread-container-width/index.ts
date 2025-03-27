import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/spa-router/listeners";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { whereAmI } from "@/utils/utils";

csLoaderRegistry.register({
  id: "plugin:thread:customThreadContainerWidth",
  dependencies: ["cache:pluginsStates"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["thread:customThreadContainerWidth"]) return;

    const { value } =
      ExtensionLocalStorageService.getCachedSync().plugins[
        "thread:customThreadContainerWidth"
      ];

    if (value < 740) return;

    setThreadWidth(whereAmI(), value);

    spaRouteChangeCompleteSubscribe((url) => {
      setThreadWidth(whereAmI(url), value);
    });
  },
});

function setThreadWidth(location: ReturnType<typeof whereAmI>, value: number) {
  const isInThread = location === "thread";

  $(document.body).css("--thread-width", isInThread ? `${value}px` : "");
  $(document.body).css(
    "--thread-content-width",
    isInThread ? `${value}px` : "",
  );
}
