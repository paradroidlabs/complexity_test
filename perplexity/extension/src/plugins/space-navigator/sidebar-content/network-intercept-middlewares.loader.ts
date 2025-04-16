import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { parseWebSocketData } from "@/plugins/_core/main-world/network-intercept/web-socket-message-parser";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:spaceNavigator:networkInterceptMiddleware": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:spaceNavigator:networkInterceptMiddleware",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["spaceNavigator"]) return;

      networkInterceptMiddlewareManager.updateMiddleware({
        id: "invalidate-spaces",
        middlewareFn({ data, skip }) {
          if (data.type !== "network-intercept:fetchEvent") {
            const wsMessage = parseWebSocketData(data.payload.data);
            const payload = wsMessage.payload;

            const hasValidMessageStructure =
              wsMessage.messageId != null &&
              Array.isArray(payload) &&
              payload.length > 0 &&
              payload[0] != null;

            if (!hasValidMessageStructure) {
              return skip();
            }

            const spaceMutationActions = [
              "create_collection",
              "delete_collection",
            ];

            const isSpaceMutationPayload = spaceMutationActions.includes(
              payload[0],
            );

            if (isSpaceMutationPayload) {
              setTimeout(() => {
                queryClient.invalidateQueries({
                  queryKey: pplxApiQueries.spaces.queryKey,
                  exact: true,
                });
              }, 3000);
            }
          } else {
            if (data.event !== "request") return skip();

            if (
              data.payload.url.includes(
                "www.perplexity.ai/rest/collections/edit_collection",
              )
            ) {
              setTimeout(() => {
                queryClient.invalidateQueries({
                  queryKey: pplxApiQueries.spaces.queryKey,
                  exact: true,
                });
              }, 3000);
            }
          }

          return skip();
        },
      });
    },
  });
}
