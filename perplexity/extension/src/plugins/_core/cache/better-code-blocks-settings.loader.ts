import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/services/indexed-db/better-code-blocks/query-keys";
import { queryClient } from "@/utils/ts-query-client";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:betterCodeBlocksFineGrainedOptions": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "cache:betterCodeBlocksFineGrainedOptions",
    dependencies: ["cache:pluginsStates"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["thread:betterCodeBlocks"]) return;

      await queryClient.prefetchQuery({
        ...betterCodeBlocksFineGrainedOptionsQueries.list,
        gcTime: Infinity,
      });
    },
  });
}
