import { createQueryKeys } from "@lukemorales/query-key-factory";

import type { PinnedSpace } from "@/data/plugins/space-navigator/pinned-space.types";
import { getPinnedSpacesService } from "@/services/indexed-db/pinned-spaces";

export const pinnedSpacesQueries = createQueryKeys("sidebarPinnedSpaces", {
  list: {
    queryKey: null,
    queryFn: () => getPinnedSpacesService().getAll(),
  },
  get: (uuid: PinnedSpace["uuid"]) => ({
    queryKey: [{ uuid }],
    queryFn: () => getPinnedSpacesService().get(uuid),
  }),
});
