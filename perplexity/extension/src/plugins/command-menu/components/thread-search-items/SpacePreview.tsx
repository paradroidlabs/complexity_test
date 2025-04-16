import { useCommandState } from "cmdk";

import Tooltip from "@/components/Tooltip";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import type { ThreadSearchApi } from "@/services/pplx-api/pplx-api.types";

export function SpacePreview({ thread }: { thread: ThreadSearchApi }) {
  const {
    setFilter,
    setSearchValue,
    setSpacethreadFilterSlug,
    setSpacethreadTitle,
    inputRef,
  } = useCommandMenuStore();

  const isHighlighted: boolean = useCommandState(
    (state) => state.value === thread.slug,
  );

  if (!thread.collection) return null;

  const handleChangeFilter = (
    e: React.MouseEvent<HTMLDivElement> | React.KeyboardEvent<HTMLDivElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!thread.collection) return;

    setFilter("spaces-threads");
    setSearchValue("");
    setSpacethreadFilterSlug(thread.collection.slug);
    setSpacethreadTitle(thread.collection.title);

    setTimeout(() => {
      inputRef?.current?.focus();
    }, 100);
  };

  return (
    <Tooltip
      content={t(
        "plugin-command-menu:commandMenu.threadSearch.spacePreview.tooltip",
      )}
    >
      <div
        className="x:rounded-md x:border x:border-border/50 x:bg-secondary x:px-2 x:py-1 x:text-xs x:outline-none x:focus:outline-2 x:focus:outline-primary x:focus-visible:outline-2 x:focus-visible:outline-primary"
        title={thread.collection.title}
        tabIndex={isHighlighted ? 0 : -1}
        onClick={handleChangeFilter}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleChangeFilter(e);
          }
        }}
      >
        <div className="x:max-w-[100px] x:truncate">
          {thread.collection.title}
        </div>
      </div>
    </Tooltip>
  );
}
