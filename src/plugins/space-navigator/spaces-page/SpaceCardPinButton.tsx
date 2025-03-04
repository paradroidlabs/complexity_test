import { useQuery } from "@tanstack/react-query";
import { LuPin, LuPinOff } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  usePinSpaceMutation,
  useUnpinSpaceMutation,
} from "@/plugins/space-navigator/sidebar-content/use-pinned-spaces-mutations";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function SpaceCardPinButton({
  htmlNode,
}: {
  htmlNode: HTMLElement;
}) {
  const slug = useMemo(() => {
    return $(htmlNode).attr("href")?.split("/").pop();
  }, [htmlNode]);

  const { data: spaces } = useQuery(pplxApiQueries.spaces);

  const { data: pinnedSpaces } = useQuery(pinnedSpacesQueries.list);

  const space = spaces?.find((space) => space.slug === slug);

  const isPinned = pinnedSpaces?.some(
    (pinnedSpace) => pinnedSpace.uuid === space?.uuid,
  );

  const { mutate: pinSpace } = usePinSpaceMutation();

  const { mutate: unpinSpace } = useUnpinSpaceMutation();

  if (space == null) return null;

  return (
    <div
      className="x-absolute x-top-2 x-right-2 x-animate-in x-fade-in"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (isPinned) {
          unpinSpace({ uuid: space.uuid });
        } else {
          pinSpace({ uuid: space.uuid });
        }
      }}
    >
      <Tooltip
        content={
          isPinned
            ? t(
                "plugin-space-navigator:spaceNavigator.spaceItem.pinActions.unpinFromSidebar",
              )
            : t(
                "plugin-space-navigator:spaceNavigator.spaceItem.pinActions.pinToSidebar",
              )
        }
      >
        <div className="x-m-1 x-rounded-md x-p-1 x-text-muted-foreground x-transition-all hover:x-bg-muted hover:x-text-foreground active:x-scale-95">
          {isPinned ? <LuPinOff /> : <LuPin />}
        </div>
      </Tooltip>
    </div>
  );
}
