import { useQuery } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";

import { CommandEmpty, CommandGroup } from "@/components/ui/command";
import SpaceThreadItem from "@/plugins/command-menu/components/space-search-items/SpaceThreadItem";
import { useCommandMenuStore } from "@/plugins/command-menu/public/store";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function SpaceThreadsSearchItems() {
  const { filter, spacethreadFilterSlug, spacethreadTitle } =
    useCommandMenuStore();

  const {
    data: spaceThreads,
    isLoading,
    isError,
  } = useQuery({
    ...pplxApiQueries.spaces.threads.detail(spacethreadFilterSlug ?? ""),
    enabled: filter === "spaces-threads" && !!spacethreadFilterSlug,
  });

  if (filter !== "spaces-threads") return null;

  if (isLoading) {
    return (
      <div className="x:flex x:animate-pulse x:items-center x:justify-center x:gap-2 x:p-4 x:text-sm x:text-muted-foreground">
        <LuLoaderCircle className="x:animate-spin" />
        <span>
          {t(
            "plugin-command-menu:commandMenu.spaceSearch.spaceThreads.loading",
            { title: spacethreadTitle },
          )}
        </span>
      </div>
    );
  }

  if (isError) {
    return (
      <CommandEmpty>
        {t("plugin-command-menu:commandMenu.spaceSearch.spaceThreads.error")}
      </CommandEmpty>
    );
  }

  if (spaceThreads && !spaceThreads?.length) {
    return (
      <CommandEmpty>
        {t("plugin-command-menu:commandMenu.spaceSearch.spaceThreads.empty")}
      </CommandEmpty>
    );
  }

  return (
    <CommandGroup
      heading={t(
        "plugin-command-menu:commandMenu.spaceSearch.spaceThreads.heading",
      )}
    >
      {spaceThreads?.map((thread) => (
        <SpaceThreadItem key={thread.uuid} thread={thread} />
      ))}
    </CommandGroup>
  );
}
