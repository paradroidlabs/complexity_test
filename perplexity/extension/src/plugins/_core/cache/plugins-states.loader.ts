import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { PluginsStatesService } from "@/services/plugins-states";
import { queryClient } from "@/utils/ts-query-client";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:pluginsStates": ReturnType<
      typeof PluginsStatesService.getEnableStatesCachedSync
    >;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "cache:pluginsStates",
    dependencies: ["cache:extensionSettings"],
    loader: async () => {
      await Promise.all([
        queryClient.prefetchQuery({
          ...cplxApiQueries.versions,
          staleTime: 1000,
        }),
        queryClient.prefetchQuery({
          ...cplxApiQueries.featureCompat,
          gcTime: Infinity,
          staleTime: Infinity,
        }),
      ]);

      return PluginsStatesService.getEnableStatesCachedSync();
    },
  });
}
