import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import usePplxAuth from "@/hooks/usePplxAuth";
import type { PplxUserSettingsApiResponse } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import type { ControlledQueryOptions } from "@/types/tanstack-query.types";

export default function usePplxUserSettings({
  ...props
}: ControlledQueryOptions<
  PplxUserSettingsApiResponse,
  typeof pplxApiQueries.userSettings.queryKey,
  "enabled"
> = {}): UseQueryResult<PplxUserSettingsApiResponse> {
  const { isLoggedIn } = usePplxAuth();

  const query = useQuery({
    ...pplxApiQueries.userSettings,
    enabled: isLoggedIn,
    staleTime: 5000,
    gcTime: Infinity,
    ...props,
  });

  return query;
}
