import { createQueryKeys } from "@lukemorales/query-key-factory";

import { PplxApiService } from "@/services/pplx-api";
import type { Space } from "@/services/pplx-api/pplx-api.types";
import { queryClient } from "@/utils/ts-query-client";

export const pplxApiQueries = createQueryKeys("pplxApi", {
  userSettings: {
    queryKey: null,
    queryFn: PplxApiService.fetchUserSettings,
  },
  auth: {
    queryKey: null,
    queryFn: PplxApiService.fetchAuthSession,
    contextQueries: {
      orgStatus: {
        queryKey: null,
        queryFn: PplxApiService.fetchOrgSettings,
      },
    },
  },
  threadInfo: (threadSlug: string) => ({
    queryKey: [{ threadSlug }],
    queryFn: () => PplxApiService.fetchThreadInfo(threadSlug),
  }),
  threadsSearch: (
    params: {
      searchValue?: string;
      limit?: number;
      offset?: number;
    } = {},
  ) => {
    return {
      queryKey: [{ ...params }],
      queryFn: () => PplxApiService.fetchThreads(params),
    };
  },
  spaces: {
    queryKey: null,
    queryFn: PplxApiService.fetchSpaces,
    contextQueries: {
      files: (spaceUuid: Space["uuid"]) => ({
        queryKey: [{ spaceUuid }],
        queryFn: () => PplxApiService.fetchSpaceFiles(spaceUuid),
        contextQueries: {
          downloadUrl: (fileUuid: string) => ({
            queryKey: [{ fileUuid }],
            queryFn: () =>
              PplxApiService.fetchSpaceFileDownloadUrl({ spaceUuid, fileUuid }),
          }),
        },
      }),
      threads: (spaceSlug: Space["slug"]) => ({
        queryKey: [{ spaceSlug }],
        queryFn: () => PplxApiService.fetchSpaceThreads(spaceSlug),
      }),
    },
  },
});

queryClient.setQueryDefaults(pplxApiQueries.spaces.queryKey, {
  staleTime: 10000,
});
