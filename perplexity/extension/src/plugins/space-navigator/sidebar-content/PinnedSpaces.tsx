import type { DragEndEvent } from "@dnd-kit/core";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { LuPinOff } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import SwappableDndProvider from "@/components/dnd/SwappableDndProvider";
import SwappableSortableItem from "@/components/dnd/SwappableSortableItem";
import Tooltip from "@/components/Tooltip";
import type { PinnedSpace } from "@/data/plugins/space-navigator/pinned-space.types";
import { useUnpinSpaceMutation } from "@/plugins/space-navigator/sidebar-content/use-pinned-spaces-mutations";
import { getPinnedSpacesService } from "@/services/indexed-db/pinned-spaces";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import type { Space } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";
import { queryClient } from "@/utils/ts-query-client";
import { emojiCodeToString } from "@/utils/utils";

type PinnedSpaceContentProps = {
  uuid: string;
  isDragging: boolean;
  isAnyDragging: boolean;
  spaces: Space[];
};

function PinnedSpaceContent({
  uuid,
  isDragging,
  isAnyDragging,
  spaces,
}: PinnedSpaceContentProps) {
  const space = spaces?.find((space) => space.uuid === uuid);

  const { mutate: unpinSpace } = useUnpinSpaceMutation();

  if (space == null) return null;

  return (
    <a
      href={`/collections/${space.slug}`}
      className={cn(
        "x:group x:flex x:cursor-pointer x:items-center x:justify-between x:rounded-sm x:px-1 x:py-1 x:transition-colors x:duration-300 x:select-none",
        isDragging && "x:opacity-75",
        !isDragging &&
          !isAnyDragging &&
          "x:hover:bg-black/5 x:dark:hover:bg-white/5",
      )}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey) return;

        e.preventDefault();
        e.stopPropagation();

        sendMessage(
          "spa-router:push",
          {
            url: `/collections/${space.slug}`,
          },
          "window",
        );
      }}
    >
      <div className="x:line-clamp-1">
        {space.emoji && (
          <span className="x:mr-1">{emojiCodeToString(space.emoji)}</span>
        )}
        <span>{space.title}</span>
      </div>
      <Tooltip
        content={t("plugin-space-navigator:spaceNavigator.pinnedSpaces.unpin")}
      >
        <div
          className={cn("x:hidden x:active:scale-95", {
            "x:group-hover:block x:hover:text-foreground":
              !isDragging && !isAnyDragging,
          })}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            unpinSpace({ uuid });
          }}
        >
          <LuPinOff />
        </div>
      </Tooltip>
    </a>
  );
}

export default function SidebarPinnedSpaces() {
  const [isCollapsed] = useLocalStorage("cplx.pinned-spaces-collapsed", false);

  const [localPinnedSpaces, setLocalPinnedSpaces] = useState<PinnedSpace[]>([]);

  const { data: spaces, isLoading: isSpacesLoading } = useQuery(
    pplxApiQueries.spaces,
  );

  const { data: pinnedSpaces = [] } = useQuery({
    ...pinnedSpacesQueries.list,
    enabled: !isCollapsed,
  });

  useEffect(() => {
    setLocalPinnedSpaces(pinnedSpaces);
  }, [pinnedSpaces]);

  const { mutate: swapSpaces } = useMutation({
    mutationFn: ({
      from,
      to,
    }: {
      from: PinnedSpace["uuid"];
      to: PinnedSpace["uuid"];
    }) => getPinnedSpacesService().swap({ from, to }),
    onMutate: async ({ from, to }) => {
      await queryClient.cancelQueries({
        queryKey: pinnedSpacesQueries.list.queryKey,
      });

      const fromIndex = localPinnedSpaces.findIndex(
        (space) => space.uuid === from,
      );
      const toIndex = localPinnedSpaces.findIndex((space) => space.uuid === to);

      if (fromIndex === -1 || toIndex === -1) return;

      const newOrder = [...localPinnedSpaces];

      if (!newOrder[fromIndex] || !newOrder[toIndex]) return;

      [newOrder[fromIndex], newOrder[toIndex]] = [
        newOrder[toIndex],
        newOrder[fromIndex],
      ];

      setLocalPinnedSpaces(newOrder);
      queryClient.setQueryData(pinnedSpacesQueries.list.queryKey, newOrder);

      return { previousSpaces: localPinnedSpaces };
    },
    onError: (err, newSpaces, context) => {
      setLocalPinnedSpaces(context?.previousSpaces ?? pinnedSpaces);
      queryClient.setQueryData(
        pinnedSpacesQueries.list.queryKey,
        context?.previousSpaces ?? pinnedSpaces,
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: pinnedSpacesQueries.list.queryKey,
      });
    },
  });

  if (localPinnedSpaces.length === 0) return null;

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeSpace = localPinnedSpaces.find(
        (space) => space.uuid === active.id,
      );
      const overSpace = localPinnedSpaces.find(
        (space) => space.uuid === over.id,
      );

      if (!activeSpace || !overSpace) return;

      swapSpaces({
        from: activeSpace.uuid,
        to: overSpace.uuid,
      });
    }
  }

  if (isSpacesLoading) return null;

  return (
    <div
      className={cn(
        PPLX_SCROLLBAR_CLASSES,
        "x:max-h-[200px] x:overflow-y-auto",
        isCollapsed && "x:hidden",
      )}
    >
      <div
        className={cn(
          "x:mt-1 x:flex x:flex-col x:gap-1 x:pr-2 x:pl-3.5 x:text-xs x:font-medium x:text-muted-foreground",
          {
            "x:ml-[26px] x:border-l x:border-border/50 x:dark:border-border":
              localPinnedSpaces.length > 0,
          },
        )}
      >
        <SwappableDndProvider
          items={localPinnedSpaces.map((item) => item.uuid)}
          onDragEnd={handleDragEnd}
        >
          {localPinnedSpaces.map((space, index) => (
            <SwappableSortableItem key={index} id={space.uuid}>
              {({ isDragging, isAnyDragging }) => (
                <PinnedSpaceContent
                  spaces={spaces ?? []}
                  uuid={space.uuid}
                  isDragging={isDragging}
                  isAnyDragging={isAnyDragging}
                />
              )}
            </SwappableSortableItem>
          ))}
        </SwappableDndProvider>
      </div>
    </div>
  );
}
