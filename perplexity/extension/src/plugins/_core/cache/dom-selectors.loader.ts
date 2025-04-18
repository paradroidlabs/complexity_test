import { onMessage } from "webext-bridge/content-script";

import { APP_CONFIG } from "@/app.config";
import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { DomSelectorsRegistry } from "@/data/dom-selectors-registry";
import type { DomSelectors } from "@/data/dom-selectors-registry/types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { errorWrapper } from "@/utils/error-wrapper";
import { queryClient } from "@/utils/ts-query-client";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:domSelectors": DomSelectors;
  }
}

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "cache:domSelectors": () => DomSelectors;
  }
}

export default async function loader() {
  asyncLoaderRegistry.register({
    id: "cache:domSelectors",
    dependencies: [],
    loader: async () => {
      if (APP_CONFIG.IS_DEV) return DomSelectorsRegistry.local;

      const [data, error] = await errorWrapper(() =>
        queryClient.fetchQuery(cplxApiQueries.domSelectors),
      )();

      if (error) return DomSelectorsRegistry.local;

      DomSelectorsRegistry.remote = data;

      return data;
    },
  });

  onMessage("cache:domSelectors", () => {
    return DomSelectorsRegistry.remote ?? DomSelectorsRegistry.local;
  });
}
