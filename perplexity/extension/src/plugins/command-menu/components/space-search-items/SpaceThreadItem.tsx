import { isHotkeyPressed } from "react-hotkeys-hook";
import { sendMessage } from "webext-bridge/content-script";

import { CommandItem } from "@/components/ui/command";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import type { ThreadSearchApi } from "@/services/pplx-api/pplx-api.types";
import { formatHowLongAgo } from "@/utils/dayjs";

type SpaceThreadItemProps = {
  thread: ThreadSearchApi;
};

export default function SpaceThreadItem({ thread }: SpaceThreadItemProps) {
  const { setOpen } = useCommandMenuStore();

  const searchKeyword = useMemo(() => {
    return (thread.title + thread.first_answer)
      .replace(/\s+/g, "")
      .toLowerCase();
  }, [thread.title, thread.first_answer]);

  return (
    <CommandItem
      key={thread.uuid}
      asChild
      value={thread.uuid}
      keywords={[searchKeyword]}
      className="x:flex x:min-h-10 x:justify-between x:gap-4"
      onSelect={() => {
        if (isHotkeyPressed("ctrl")) {
          window.open(`/search/${thread.slug}`, "_blank");
        } else {
          sendMessage(
            "spa-router:push",
            {
              url: `/search/${thread.slug}`,
            },
            "window",
          );
          setOpen(false);
        }
      }}
    >
      <a
        href={`/search/${thread.slug}`}
        className="x:flex x:w-full x:items-center x:justify-between"
      >
        <div className="x:flex-1">
          <div className="x:line-clamp-1">{thread.title.slice(0, 100)}</div>
        </div>
        <div className="x:flex x:flex-shrink-0 x:items-center x:gap-2">
          <div className="x:flex-shrink-0 x:text-xs x:text-muted-foreground">
            {formatHowLongAgo(thread.last_query_datetime)}
          </div>
        </div>
      </a>
    </CommandItem>
  );
}
