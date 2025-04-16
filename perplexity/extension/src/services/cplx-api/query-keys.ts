import { createQueryKeys } from "@lukemorales/query-key-factory";

import { CplxApiService } from "@/services/cplx-api";
import { queryClient } from "@/utils/ts-query-client";

export const cplxApiQueries = createQueryKeys("cplxApi", {
  versions: {
    queryKey: null,
    queryFn: CplxApiService.fetchVersions,
  },
  featureCompat: {
    queryKey: null,
    queryFn: CplxApiService.fetchFeatureCompat,
  },
  remoteLanguageModels: {
    queryKey: null,
    queryFn: CplxApiService.fetchLanguageModels,
  },
  changelog: ({ version }: { version?: string } = {}) => ({
    queryKey: [{ version }],
    queryFn: () => CplxApiService.fetchChangelog({ version }),
  }),
});

queryClient.setQueryDefaults(cplxApiQueries.versions.queryKey, {
  retry: false,
});

queryClient.setQueryDefaults(cplxApiQueries.featureCompat.queryKey, {
  retry: false,
});
