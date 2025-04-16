import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { getPinnedSpacesService } from "@/services/indexed-db/pinned-spaces";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function SidebarPinnedSpacesVisToggle() {
  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "cplx.pinned-spaces-collapsed",
    false,
  );

  const { data: pinnedSpaces } = useQuery({
    ...pinnedSpacesQueries.list,
    enabled: !isCollapsed,
  });

  useCleanUpNonExistingPinnedSpaces();

  if (!pinnedSpaces || pinnedSpaces.length === 0) return null;

  return (
    <Tooltip
      content={
        isCollapsed
          ? t(
              "plugin-space-navigator:spaceNavigator.pinnedSpaces.toggleVisibility.expand",
            )
          : t(
              "plugin-space-navigator:spaceNavigator.pinnedSpaces.toggleVisibility.collapse",
            )
      }
    >
      <div
        className="x:invisible x:flex x:size-6 x:items-center x:justify-center x:text-foreground x:opacity-0 x:transition-all x:group-hover:visible x:group-hover:opacity-100 x:hover:bg-black/5 x:dark:hover:bg-white/5"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();

          setIsCollapsed((prev) => !prev);
        }}
      >
        {isCollapsed ? <LuChevronDown /> : <LuChevronUp />}
      </div>
    </Tooltip>
  );
}

function useCleanUpNonExistingPinnedSpaces() {
  const { data: spaces, isSuccess: isSpacesFetchSuccess } = useQuery(
    pplxApiQueries.spaces,
  );

  const { data: pinnedSpaces, isSuccess: isPinnedSpacesFetchSuccess } =
    useQuery(pinnedSpacesQueries.list);

  useEffect(() => {
    if (!isSpacesFetchSuccess || !isPinnedSpacesFetchSuccess) return;

    pinnedSpaces.forEach((pinnedSpace) => {
      if (!spaces.some((space) => space.uuid === pinnedSpace.uuid)) {
        getPinnedSpacesService().delete(pinnedSpace.uuid);
      }
    });
  }, [isSpacesFetchSuccess, isPinnedSpacesFetchSuccess, spaces, pinnedSpaces]);
}
