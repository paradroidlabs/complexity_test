import { useQuery } from "@tanstack/react-query";

import { getLocalThemesService } from "@/services/indexed-db/themes";

export function useLocalThemes() {
  return useQuery({
    queryKey: ["localThemes"],
    queryFn: () => getLocalThemesService().getAll(),
  });
}
