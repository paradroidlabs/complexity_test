import debounce from "lodash/debounce";

import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { queryClient } from "@/utils/ts-query-client";
import { jsonUtils } from "@/utils/utils";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "networkIntercept:pplxApi": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "networkIntercept:pplxApi",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      const shouldInvalidatePplxUserSettings =
        pluginsStates["queryBox:languageModelSelector"] === true ||
        pluginsStates?.imageGenModelSelector === true;

      if (shouldInvalidatePplxUserSettings) {
        networkInterceptMiddlewareManager.addMiddleware({
          id: "invalidate-pplx-user-settings",
          middlewareFn({ data, skip }) {
            const isSSEResponse =
              data.type === "network-intercept:fetchEvent" &&
              data.event === "response";

            if (!isSSEResponse) {
              return skip();
            }

            console.log({
              data: jsonUtils.safeParse(data.payload.data),
              url: data.payload.url,
            });

            const shouldInvalidateSettings =
              data.payload.url ===
                "https://www.perplexity.ai/rest/sse/perplexity_ask" &&
              data.payload.data === "{}";

            if (shouldInvalidateSettings) {
              invalidateSettings();
            }

            return skip();
          },
        });
      }
    },
  });
}

const invalidateSettings = debounce(() => {
  setTimeout(() => {
    queryClient.invalidateQueries({
      queryKey: pplxApiQueries.userSettings.queryKey,
    });
  }, 3000);
}, 2000);
