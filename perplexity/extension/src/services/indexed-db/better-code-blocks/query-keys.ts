import { createQueryKeys } from "@lukemorales/query-key-factory";

import { getBetterCodeBlocksFineGrainedOptionsService } from "@/services/indexed-db/better-code-blocks";

export const betterCodeBlocksFineGrainedOptionsQueries = createQueryKeys(
  "betterCodeBlocksFineGrainedOptions",
  {
    list: {
      queryKey: null,
      queryFn: () => getBetterCodeBlocksFineGrainedOptionsService().getAll(),
    },
    get: (language: string) => ({
      queryKey: [{ language }],
      queryFn: () =>
        getBetterCodeBlocksFineGrainedOptionsService().get(language),
    }),
  },
);
