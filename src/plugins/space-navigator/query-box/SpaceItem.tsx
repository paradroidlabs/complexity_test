import { isHotkeyPressed } from "react-hotkeys-hook";
import { sendMessage } from "webext-bridge/content-script";

import { CommandItem } from "@/components/ui/command";
import { useSpaRouter } from "@/plugins/_core/spa-router/listeners";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { emojiCodeToString, parseUrl } from "@/utils/utils";

export default function SpaceItem({
  space,
  setOpen,
}: {
  space: Space;
  setOpen: (open: boolean) => void;
}) {
  const url = useSpaRouter((state) => state.url);

  const spaceSlugFromUrl = parseUrl(url).pathname.split("/").pop();

  const isOnSpacePage =
    spaceSlugFromUrl === space.slug || spaceSlugFromUrl === space.uuid;

  return (
    <CommandItem
      key={space.uuid}
      asChild
      className={cn("x:relative x:min-h-10 x:text-sm x:font-medium", {
        "x:text-primary": isOnSpacePage,
      })}
      value={space.uuid}
      keywords={[
        space.title,
        space.description?.slice(0, 100),
        space.instructions?.slice(0, 100),
      ]}
      onSelect={() => {
        if (isHotkeyPressed(Key.Control) || isHotkeyPressed(Key.Meta)) return;

        setOpen(false);

        sendMessage(
          "spa-router:push",
          {
            url: `/collections/${space.slug}`,
          },
          "window",
        );
      }}
    >
      <a
        href={`/collections/${space.slug}`}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey) return;

          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="x:flex x:items-center x:gap-2">
          {space.emoji && <div>{emojiCodeToString(space.emoji)}</div>}
          {space.title}
        </div>
        <div className="x:ml-2 x:flex x:items-center x:gap-1">
          {isOnSpacePage && (
            <div className="x:text-xs x:text-muted-foreground">
              {t(
                "plugin-space-navigator:spaceNavigator.spaceItem.currentLocation",
              )}
            </div>
          )}
        </div>
      </a>
    </CommandItem>
  );
}
