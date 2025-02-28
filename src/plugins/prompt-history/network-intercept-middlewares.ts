import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { parsePerplexityAskEvent } from "@/plugins/_core/network-intercept/utils/parse-perplexity-ask-event";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { getPromptHistoryService } from "@/services/indexed-db/prompt-history";
import { promptHistoryQueries } from "@/services/indexed-db/prompt-history/query-keys";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";

csLoaderRegistry.register({
  id: "plugin:queryBox:promptHistory:networkInterceptMiddleware",
  dependencies: ["cache:pluginsStates", "cache:extensionLocalStorage"],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates["queryBox:slashCommandMenu"] ||
      !pluginsEnableStates["queryBox:slashCommandMenu:promptHistory"] ||
      !settings.plugins["queryBox:slashCommandMenu:promptHistory"].trigger
        .onSubmit
    )
      return;

    networkInterceptMiddlewareManager.updateMiddleware({
      id: "submit-prompt-tracker",
      async middlewareFn({ data, skip }) {
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

        const isRewriteMessage = parsedData.params.query_source == "retry";

        if (isRewriteMessage) {
          return skip();
        }

        const promptString = parsedData.query_str;

        if (promptString.length < 1) {
          return skip();
        }

        await getPromptHistoryService().deduplicateAdd(promptString);

        queryClient.invalidateQueries({
          queryKey: promptHistoryQueries.list.queryKey,
          exact: true,
        });

        return skip();
      },
    });
  },
});
