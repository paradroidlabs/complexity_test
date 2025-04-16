import { isHotkeyPressed } from "react-hotkeys-hook";
import { sendMessage } from "webext-bridge/content-script";

import { CommandItem } from "@/components/ui/command";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import { SpacePreview } from "@/plugins/command-menu/components/thread-search-items/SpacePreview";
import type { ThreadSearchApi } from "@/services/pplx-api/pplx-api.types";
import { formatHowLongAgo } from "@/utils/dayjs";

type ThreadItemProps = {
  thread: ThreadSearchApi;
};

export function ThreadItem({ thread }: ThreadItemProps) {
  const { setOpen } = useCommandMenuStore();

  return (
    <CommandItem
      key={thread.slug}
      asChild
      value={thread.slug}
      className="x:flex x:h-10 x:items-center x:justify-between x:gap-8 x:font-medium"
      onSelect={() => {
        if (isHotkeyPressed("ctrl"))
          return window.open(`/search/${thread.slug}`, "_blank");

        sendMessage(
          "spa-router:push",
          {
            url: `/search/${thread.slug}`,
          },
          "window",
        );

        setOpen(false);
      }}
    >
      <a
        href={`/search/${thread.slug}`}
        className="x:flex x:w-full x:items-center x:justify-between"
      >
        <div className="x:flex-1">
          <div className="x:line-clamp-1" title={thread.title}>
            {thread.title.slice(0, 100)}
          </div>
        </div>
        <div className="x:flex x:flex-shrink-0 x:items-center x:gap-2">
          <SpacePreview thread={thread} />
          <div className="x:flex-shrink-0 x:text-xs x:text-muted-foreground">
            {formatHowLongAgo(thread.last_query_datetime)}
          </div>
        </div>
      </a>
    </CommandItem>
  );
}
