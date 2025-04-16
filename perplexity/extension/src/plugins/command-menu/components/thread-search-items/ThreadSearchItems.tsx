import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";

import { CommandEmpty, CommandGroup } from "@/components/ui/command";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import { EmptyState } from "@/plugins/command-menu/components/thread-search-items/EmptyState";
import { LoadingState } from "@/plugins/command-menu/components/thread-search-items/LoadingState";
import { ThreadItem } from "@/plugins/command-menu/components/thread-search-items/ThreadItem";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function ThreadSearchItems() {
  const { searchValue, filter } = useCommandMenuStore();
  const debouncedSearchValue = useDebounce(searchValue, 300);

  const {
    data: threads,
    isFetching: isFetchingThreads,
    isLoading: isLoadingThreads,
    isError,
  } = useQuery({
    ...pplxApiQueries.threadsSearch({
      searchValue: debouncedSearchValue,
      limit: debouncedSearchValue.length > 0 ? 20 : undefined,
    }),
    enabled: filter === "threads",
    placeholderData: keepPreviousData,
    refetchOnWindowFocus: false,
  });

  if (filter !== "threads") return null;

  return (
    <div
      className={cn("x:transition-opacity", {
        "x:opacity-50": isFetchingThreads || isLoadingThreads,
      })}
    >
      {!isError && !isLoadingThreads && (
        <EmptyState searchValue={searchValue} />
      )}
      {isError && (
        <CommandEmpty>
          {t("plugin-command-menu:commandMenu.threadSearch.error")}
        </CommandEmpty>
      )}
      <CommandGroup
        heading={
          threads && threads.length > 0
            ? searchValue
              ? t(
                  "plugin-command-menu:commandMenu.threadSearch.heading.withSearch",
                  { count: threads.length },
                )
              : t(
                  "plugin-command-menu:commandMenu.threadSearch.heading.withoutSearch",
                )
            : ""
        }
      >
        {isLoadingThreads && <LoadingState />}
        {threads?.map((thread) => (
          <ThreadItem key={thread.slug} thread={thread} />
        ))}
      </CommandGroup>
    </div>
  );
}
