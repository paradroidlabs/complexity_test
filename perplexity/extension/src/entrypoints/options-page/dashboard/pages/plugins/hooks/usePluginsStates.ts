import { useQuery } from "@tanstack/react-query";

import { APP_CONFIG } from "@/app.config";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import type { PluginsStates } from "@/services/plugins-states/utils";
import {
  initializePluginStates,
  updatePluginStatesWithFeatureCompat,
} from "@/services/plugins-states/utils";

export default function usePluginsStates() {
  const { data: featureCompat, isLoading: isFetchingFeatureCompat } = useQuery({
    ...cplxApiQueries.featureCompat,
    staleTime: 1000,
    retryOnMount: false, // important, without this the query will be refetching indefinitely if queryFn throws error
  });

  const { latestVersion, isLoading: isLoadingLatestVersion } =
    useExtensionUpdate();

  const { data: pluginsStates } = useQuery({
    queryKey: ["pluginsStates"],
    queryFn: () => initializePluginStates(),
    initialData: initializePluginStates(),
    select: (initialState: PluginsStates) =>
      updatePluginStatesWithFeatureCompat(
        initialState,
        featureCompat,
        APP_CONFIG.VERSION,
        latestVersion,
      ),
    enabled: !!featureCompat && !!latestVersion,
  });

  const isLoading = isFetchingFeatureCompat || isLoadingLatestVersion;

  return {
    pluginsStates,
    isLoading,
  };
}
