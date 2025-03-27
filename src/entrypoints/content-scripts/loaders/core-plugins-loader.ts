import {
  allowWindowMessaging,
  sendMessage,
} from "webext-bridge/content-script";

import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import { CorePluginId } from "@/data/plugins-data/plugins-data.types";
import { InternalWebSocketManager } from "@/plugins/_api/web-socket/internal-web-socket-manager";
import { internalWebSocketStore } from "@/plugins/_core/web-socket/store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { injectMainWorldScript, insertCss } from "@/utils/utils";

import markmapRendererPlugin from "@/plugins/_core/markmap-renderer/index?script&module";
import mermaidRendererPlugin from "@/plugins/_core/mermaid-renderer/index?script&module";
import networkInterceptPlugin from "@/plugins/_core/network-intercept/index?script&module";
import reactVdomPlugin from "@/plugins/_core/react-vdom/index?script&module";
import spaRouterPlugin from "@/plugins/_core/spa-router/index?script&module";
import jqueryExtensions from "@/utils/jquery.extensions?script&module";
import webextBridgeSetNamespace from "@/utils/webext-bridge?script&module";

export async function initCorePlugins() {
  await injectMainWorldScript({
    url: chrome.runtime.getURL(webextBridgeSetNamespace),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(jqueryExtensions),
    head: true,
    inject: true,
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(networkInterceptPlugin),
    head: true,
    inject: shouldEnableCorePlugin("networkIntercept"),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(spaRouterPlugin),
    head: true,
    inject: shouldEnableCorePlugin("spaRouter"),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(reactVdomPlugin),
    head: true,
    inject: shouldEnableCorePlugin("reactVdom"),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(mermaidRendererPlugin),
    head: true,
    inject: shouldEnableCorePlugin("mermaidRenderer"),
  });

  injectMainWorldScript({
    url: chrome.runtime.getURL(markmapRendererPlugin),
    head: true,
    inject: shouldEnableCorePlugin("markmapRenderer"),
  });

  if (shouldEnableCorePlugin("webSocket")) {
    InternalWebSocketManager.getInstance()
      .handShake()
      .then((socket) => {
        internalWebSocketStore.setState({
          common: socket,
        });
      });
  }
}

function shouldEnableCorePlugin(corePluginId: CorePluginId) {
  const pluginsEnableStates = PluginsStatesService.getEnableStatesCachedSync();

  const shouldInject = Object.entries(pluginsEnableStates).some(
    ([pluginId, enabled]) => {
      if (!enabled) return false;

      const pluginMetadata = PLUGINS_METADATA[pluginId as PluginId];
      if (!pluginMetadata?.dependentCorePlugins) return false;

      return pluginMetadata.dependentCorePlugins.includes(corePluginId);
    },
  );

  return shouldInject;
}

csLoaderRegistry.register({
  id: "plugins:core",
  loader: initCorePlugins,
  dependencies: ["cache:extensionLocalStorage"],
});

csLoaderRegistry.register({
  id: "messaging:namespaceSetup",
  loader: () => {
    allowWindowMessaging("com.complexity");
  },
});

csLoaderRegistry.register({
  id: "plugin:pplxThemeLoader",
  dependencies: ["cache:extensionLocalStorage"],
  loader: async () => {
    const chosenThemeId = ExtensionLocalStorageService.getCachedSync().theme;
    const css = await getThemeCss(chosenThemeId);

    insertCss({
      css,
      id: "cplx-custom-theme",
    });

    if (ExtensionLocalStorageService.getCachedSync().preloadTheme)
      sendMessage("bg:removePreloadedTheme", undefined, "background");
  },
});
