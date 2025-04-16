import { createQueryKeys } from "@lukemorales/query-key-factory";

import { getPromptHistoryService } from "@/services/indexed-db/prompt-history";

export const ITEMS_PER_PAGE = 5;

export const promptHistoryQueries = createQueryKeys("promptHistory", {
  infinite: ({ searchTerm }: { searchTerm?: string }) => ({
    queryKey: [{ searchTerm }],
    queryFn: (ctx) =>
      getPromptHistoryService().getPaginatedItems({
        searchTerm: searchTerm,
        offset: ((ctx.pageParam as number) ?? 0) * ITEMS_PER_PAGE,
        limit: ITEMS_PER_PAGE,
      }),
  }),
  list: {
    queryKey: null,
    queryFn: () => getPromptHistoryService().getAll(),
  },
  get: (id: string) => ({
    queryKey: [{ id }],
    queryFn: () => getPromptHistoryService().get(id),
  }),
});
