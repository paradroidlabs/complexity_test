import { useQuery } from "@tanstack/react-query";
import semver from "semver";

import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";

export default function useExtensionUpdate() {
  const { data: versions, isLoading } = useQuery({
    ...cplxApiQueries.versions,
    staleTime: 1000,
    retryOnMount: false, // important, without this the query will be refetching indefinitely if queryFn throws error
  });

  const isUpdateAvailable = useMemo(() => {
    if (!versions) return false;

    const currentVersion = APP_CONFIG.VERSION;
    const latestVersion = versions.latest;

    return semver.gt(
      semver.coerce(latestVersion)!,
      semver.coerce(currentVersion)!,
    );
  }, [versions]);

  return {
    isUpdateAvailable,
    latestVersion: versions?.latest,
    isLoading,
  };
}
