import { produce } from "immer";

import { pluginGuardsStore } from "@/components/plugins-guard/store";
import { isReasoningLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import {
  encodePerplexityAskEvent,
  parsePerplexityAskEvent,
} from "@/plugins/_core/network-intercept/utils/parse-perplexity-ask-event";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

csLoaderRegistry.register({
  id: "networkIntercept:languageModelSelector",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["queryBox:languageModelSelector"]) return;

    const unsub = pluginGuardsStore.subscribe(({ hasActiveSub }) => {
      if (!hasActiveSub) return;

      unsub();

      networkInterceptMiddlewareManager.updateMiddleware({
        id: "force-change-language-model",
        middlewareFn({ data, skip }) {
          const isWSSend =
            data.type === "network-intercept:webSocketEvent" &&
            data.event === "send";
          const isSSESend =
            data.type === "network-intercept:fetchEvent" &&
            data.event === "request";

          if (!isWSSend && !isSSESend) {
            return skip();
          }

          const parsedData = parsePerplexityAskEvent({
            rawData: data.payload.data,
            url: data.payload.url,
          });

          if (parsedData == null) return skip();

          const isRetry = parsedData.params.query_source == "retry";

          const settings = ExtensionLocalStorageService.getCachedSync();

          const newParams = produce(parsedData.params, (draft: any) => {
            draft.timezone =
              settings.devMode &&
              settings.plugins["queryBox:languageModelSelector"].changeTimezone
                ? "America/Los_Angeles"
                : parsedData.params.timezone;

            if (!isRetry) {
              const { isProSearchEnabled, selectedLanguageModel } =
                sharedQueryBoxStore.getState();

              const isReasoningMode = isReasoningLanguageModelCode(
                selectedLanguageModel,
              );

              draft.model_preference = selectedLanguageModel;
              draft.mode =
                isProSearchEnabled || isReasoningMode ? "copilot" : "concise";
            }
          });

          const newEncodedPayload = encodePerplexityAskEvent({
            newPayload: {
              ...parsedData,
              params: newParams,
            },
            url: data.payload.url,
          });

          return newEncodedPayload;
        },
      });
    });
  },
});
