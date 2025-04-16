import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { parsePerplexityAskEvent } from "@/plugins/_core/main-world/network-intercept/utils/parse-perplexity-ask-event";
import { getPromptHistoryService } from "@/services/indexed-db/prompt-history";
import { promptHistoryQueries } from "@/services/indexed-db/prompt-history/query-keys";
import { queryClient } from "@/utils/ts-query-client";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:queryBox:promptHistory:networkInterceptMiddleware": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:queryBox:promptHistory:networkInterceptMiddleware",
    dependencies: ["cache:pluginsStates", "cache:extensionSettings"],
    loader: ({
      "cache:pluginsStates": pluginsStates,
      "cache:extensionSettings": extensionSettings,
    }) => {
      if (
        !pluginsStates["queryBox:slashCommandMenu"] ||
        !pluginsStates["queryBox:slashCommandMenu:promptHistory"] ||
        !extensionSettings.plugins["queryBox:slashCommandMenu:promptHistory"]
          .trigger.onSubmit
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
}
