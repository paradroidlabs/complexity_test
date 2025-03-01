import { useQuery } from "@tanstack/react-query";
import { useCommandState } from "cmdk";
import { LuLink, LuPin, LuPinOff } from "react-icons/lu";

import MarkdownRenderer from "@/components/MarkdownRenderer";
import Tooltip from "@/components/Tooltip";
import SpaceItemFile from "@/plugins/space-navigator/sidebar-content/SpaceItemFile";
import {
  usePinSpaceMutation,
  useUnpinSpaceMutation,
} from "@/plugins/space-navigator/sidebar-content/use-pinned-spaces-mutations";
import { pinnedSpacesQueries } from "@/services/indexed-db/pinned-spaces/query-keys";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";

export default function SpaceItemPreview({ spaces }: { spaces: Space[] }) {
  const space: Space | undefined = useCommandState((state) => {
    const selectedSpaceUuid = state.value;
    return spaces?.find((space) => space.uuid === selectedSpaceUuid);
  });

  const isHighlighted: boolean = useCommandState(
    (state) => state.value === space?.uuid,
  );

  const { data: files } = useQuery({
    ...pplxApiQueries.spaces._ctx.files(space?.uuid ?? ""),
    enabled: space != null && isHighlighted,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 30000,
  });

  if (space == null) return null;

  const isEmptyView =
    !space.description &&
    !space.instructions &&
    (files?.num_total_files ?? 0) <= 0;

  if (isEmptyView)
    return (
      <div className="x-relative x-flex x-size-full x-items-center x-justify-center x-text-muted-foreground">
        <PinSpaceButton space={space} />
        <div>
          {t("plugin-space-navigator:spaceNavigator.spaceItem.noPreviewData")}
        </div>
      </div>
    );

  return (
    <div className="x-relative x-flex x-flex-col x-gap-4 x-p-4">
      <PinSpaceButton space={space} />

      {space.description && (
        <div className="x-flex x-flex-col x-justify-between x-gap-2">
          <div className="x-text-sm x-font-medium x-text-muted-foreground">
            {t(
              "plugin-space-navigator:spaceNavigator.spaceItem.details.description",
            )}
          </div>
          <div className="x-line-clamp-1 x-whitespace-pre-wrap">
            {space.description}
          </div>
        </div>
      )}
      {space.instructions && (
        <div className="x-flex x-flex-col x-justify-between x-gap-2">
          <div className="x-text-sm x-font-medium x-text-muted-foreground">
            {t(
              "plugin-space-navigator:spaceNavigator.spaceItem.details.instructions",
            )}
          </div>
          <div className="custom-scrollbar x-max-h-[240px] x-overflow-y-auto x-rounded-md x-bg-secondary x-p-2">
            <MarkdownRenderer markdown={space.instructions} />
          </div>
        </div>
      )}
      {space.focused_web_config &&
        space.focused_web_config.link_configs.length > 0 && (
          <div className="x-flex x-flex-col x-justify-between x-gap-2">
            <div className="x-truncate x-text-sm x-font-medium x-text-muted-foreground">
              {t(
                "plugin-space-navigator:spaceNavigator.spaceItem.details.focusedWebLinks",
                {
                  count: space.focused_web_config.link_configs.length,
                },
              )}
            </div>
            <div className="x-flex x-flex-wrap x-items-center x-gap-2">
              {space.focused_web_config.link_configs.map((link, idx) => (
                <div key={idx} className="x-flex x-items-center x-gap-2">
                  <LuLink className="x-size-4" />
                  <div className="x-line-clamp-1 x-underline">{link.link}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      {files && files?.num_total_files > 0 && (
        <div className="x-flex x-flex-col x-justify-between x-gap-2">
          <div className="x-text-sm x-font-medium x-text-muted-foreground">
            {t(
              "plugin-space-navigator:spaceNavigator.spaceItem.details.files",
              {
                count: files.num_total_files,
              },
            )}
          </div>
          {files.files.map((file, index) => (
            <SpaceItemFile key={index} file={file} spaceUuid={space.uuid} />
          ))}
        </div>
      )}
    </div>
  );
}

function PinSpaceButton({ space }: { space: Space }) {
  const { data: pinnedSpaces } = useQuery(pinnedSpacesQueries.list);

  const isPinned = pinnedSpaces?.some(
    (pinnedSpace) => pinnedSpace.uuid === space.uuid,
  );

  const { mutate: pinSpaceOnSidebar } = usePinSpaceMutation();
  const { mutate: unpinSpace } = useUnpinSpaceMutation();

  return (
    <div className="x-absolute x-right-2 x-top-2">
      <Tooltip
        content={t(
          `plugin-space-navigator:spaceNavigator.spaceItem.pinActions.${isPinned ? "unpin" : "pin"}`,
        )}
      >
        <div
          className="x-cursor-pointer x-rounded-md x-p-2 x-text-muted-foreground x-transition-all hover:x-bg-secondary hover:x-text-foreground active:x-scale-95"
          onClick={() => {
            if (isPinned) {
              unpinSpace({ uuid: space.uuid });
            } else {
              pinSpaceOnSidebar({ uuid: space.uuid });
            }
          }}
        >
          {isPinned ? (
            <LuPinOff className="x-size-4" />
          ) : (
            <LuPin className="x-size-4" />
          )}
        </div>
      </Tooltip>
    </div>
  );
}
