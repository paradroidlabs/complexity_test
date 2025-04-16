import { useInfiniteQuery, useQueries, useQuery } from "@tanstack/react-query";
import semver from "semver";

import { APP_CONFIG } from "@/app.config";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";

export function useVersionPagination() {
  const { data: versions } = useQuery({
    ...cplxApiQueries.versions,
  });

  const availableVersions = useMemo(() => {
    if (!versions?.changelogEntries) return [];
    return versions.changelogEntries.filter((version) =>
      semver.lte(semver.coerce(version)!, semver.coerce(APP_CONFIG.VERSION)!),
    );
  }, [versions?.changelogEntries]);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ["versionPagination", versions?.changelogEntries],
    queryFn: ({ pageParam = 0 }) => {
      const startIndex = pageParam as number;
      const count = 1;
      const endIndex = startIndex + count;
      return availableVersions.slice(startIndex, endIndex);
    },
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const startIndex = lastPageParam as number;
      const nextIndex = startIndex + lastPage.length;
      return nextIndex < availableVersions.length ? nextIndex : undefined;
    },
    initialPageParam: 0,
    enabled: availableVersions.length > 0,
  });

  const loadedVersions = useMemo(() => {
    return data?.pages.flat() || [];
  }, [data?.pages]);

  const changelogQueries = useQueries({
    queries: loadedVersions.map((version) => ({
      ...cplxApiQueries.changelog({ version }),
      staleTime: Infinity,
    })),
  });

  return {
    loadedVersions,
    hasMore: !!hasNextPage,
    loadNextVersions: () => fetchNextPage(),
    changelogQueries,
  };
}
