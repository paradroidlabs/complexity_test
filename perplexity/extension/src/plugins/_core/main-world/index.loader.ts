import { allowWindowMessaging } from "webext-bridge/content-script";

import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { PluginRegistry } from "@/data/plugin-registry";
import type { PluginId } from "@/data/plugin-registry/types";
import { InternalWebSocketManager } from "@/plugins/_api/web-socket/internal-web-socket-manager";
import { internalWebSocketStore } from "@/plugins/_core/global-stores/web-socket";
import type { MainWorldCorePluginId } from "@/plugins/_core/main-world/types";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { injectMainWorldScript, insertCss } from "@/utils/utils";

import markmapRendererPlugin from "@/plugins/_core/main-world/markmap-renderer?script&module";
import mermaidRendererPlugin from "@/plugins/_core/main-world/mermaid-renderer/index?script&module";
import networkInterceptPlugin from "@/plugins/_core/main-world/network-intercept/index?script&module";
import reactVdomPlugin from "@/plugins/_core/main-world/react-vdom/index?script&module";
import spaRouterPlugin from "@/plugins/_core/main-world/spa-router/index?script&module";
import jqueryExtensions from "@/utils/jquery.extensions?script&module";
import webextBridgeSetNamespace from "@/utils/webext-bridge?script&module";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugins:mainWorldCorePlugins": void;
    "plugin:pplxThemeLoader": void;
  }
}

export default function loader() {
  allowWindowMessaging("com.complexity.perplexity");

  asyncLoaderRegistry.register({
    id: "plugins:mainWorldCorePlugins",
    dependencies: ["cache:pluginsStates"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
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
        inject: shouldEnable("networkIntercept"),
      });

      injectMainWorldScript({
        url: chrome.runtime.getURL(spaRouterPlugin),
        head: true,
        inject: shouldEnable("spaRouter"),
      });

      injectMainWorldScript({
        url: chrome.runtime.getURL(reactVdomPlugin),
        head: true,
        inject: shouldEnable("reactVdom"),
      });

      injectMainWorldScript({
        url: chrome.runtime.getURL(mermaidRendererPlugin),
        head: true,
        inject: shouldEnable("mermaidRenderer"),
      });

      injectMainWorldScript({
        url: chrome.runtime.getURL(markmapRendererPlugin),
        head: true,
        inject: shouldEnable("markmapRenderer"),
      });

      if (shouldEnable("webSocket")) {
        InternalWebSocketManager.getInstance()
          .handShake()
          .then((socket) => {
            internalWebSocketStore.setState({
              common: socket,
            });
          });
      }

      function shouldEnable(corePluginId: MainWorldCorePluginId) {
        const shouldInject = Object.entries(pluginsStates).some(
          ([pluginId, enabled]) => {
            if (!enabled) return false;

            const pluginManifest =
              PluginRegistry.manifests[pluginId as PluginId];
            if (!pluginManifest?.dependentMainWorldCorePlugins) return false;

            return pluginManifest.dependentMainWorldCorePlugins.includes(
              corePluginId,
            );
          },
        );

        return shouldInject;
      }
    },
  });

  asyncLoaderRegistry.register({
    id: "plugin:pplxThemeLoader",
    dependencies: ["cache:extensionSettings"],
    loader: async ({ "cache:extensionSettings": extensionSettings }) => {
      const chosenThemeId = extensionSettings.theme;
      const css = await getThemeCss(chosenThemeId);

      insertCss({
        css,
        id: "cplx-custom-theme",
      });
    },
  });
}
