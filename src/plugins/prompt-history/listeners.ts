import { spaRouterStoreSubscribe } from "@/plugins/_core/spa-router/listeners";
import { handlePromptSave } from "@/plugins/prompt-history/utils";
import { slashCommandMenuStore } from "@/plugins/slash-command-menu/store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "plugin:queryBox:promptHistory:listeners",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates["queryBox:slashCommandMenu"] ||
      !pluginsEnableStates["queryBox:slashCommandMenu:promptHistory"] ||
      !settings.plugins["queryBox:slashCommandMenu:promptHistory"].trigger
        .onNavigation
    )
      return;

    // Soft navigation
    spaRouterStoreSubscribe((params) => {
      slashCommandMenuStore.getState().actions.setIsOpen(false);

      if (params.state === "pending") {
        handlePromptSave({
          url: params.url,
          type: "soft",
        });
      }
    });

    // Hard navigation
    window.addEventListener("beforeunload", () => {
      handlePromptSave({ url: window.location.pathname, type: "hard" });
    });
  },
});
