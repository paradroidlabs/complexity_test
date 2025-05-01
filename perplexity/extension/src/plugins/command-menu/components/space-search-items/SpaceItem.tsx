import { useDebounce } from "@uidotdev/usehooks";
import { useCommandState } from "cmdk";
import { isHotkeyPressed } from "react-hotkeys-hook";
import { sendMessage } from "webext-bridge/content-script";

import AtomicSimple from "@/components/icons/AtomicSimple";
import KeyCombo from "@/components/KeyCombo";
import { CommandItem } from "@/components/ui/command";
import { AdditionalInfos } from "@/plugins/command-menu/components/space-search-items/AdditionalInfos";
import { useCommandMenuStore } from "@/plugins/command-menu/public/store";
import { PplxLanguageModelsService } from "@/services/cplx-api/remote-resources/pplx-language-models";
import type { Space } from "@/services/pplx-api/pplx-api.types";
import { emojiCodeToString } from "@/utils/utils";

type SpaceItemProps = {
  space: Space;
};

export function SpaceItem({ space }: SpaceItemProps) {
  const {
    setOpen,
    setFilter,
    setSearchValue,
    setSpacethreadFilterSlug,
    setSpacethreadTitle,
  } = useCommandMenuStore();

  const isHighlighted: boolean = useCommandState(
    (state) => state.value === space.uuid,
  );

  const searchKeyword = useMemo(() => {
    return (space.title + space.description + space.instructions)
      .replace(/\s+/g, "")
      .toLowerCase();
  }, [space]);

  const modelSelection = useMemo(() => {
    return PplxLanguageModelsService.allModels.find(
      (model) => model.code === space.model_selection,
    );
  }, [space]);

  return (
    <CommandItem
      key={space.uuid}
      asChild
      value={space.uuid}
      keywords={[searchKeyword]}
      className={cn(
        "x:flex x:min-h-10 x:items-center x:font-medium",
        isHighlighted && "x:h-max",
      )}
      onSelect={() => {
        if (isHotkeyPressed("ctrl"))
          return window.open(`/collections/${space.slug}`, "_blank");
        else if (isHotkeyPressed("shift")) {
          setFilter("spaces-threads");
          setSearchValue("");
          setSpacethreadFilterSlug(space.slug);
          setSpacethreadTitle(space.title);
        } else {
          sendMessage(
            "spa-router:push",
            {
              url: `/collections/${space.slug}`,
            },
            "window",
          );

          setOpen(false);
        }
      }}
    >
      <a
        href={`/collections/${space.slug}`}
        className="x:flex x:h-full x:w-full x:flex-col x:gap-2"
      >
        <div className="x:flex x:w-full x:items-center x:justify-between">
          <div className="x:flex x:flex-1 x:items-center x:gap-2">
            {space.emoji && <div>{emojiCodeToString(space.emoji)}</div>}
            <div className="x:line-clamp-1">{space.title.slice(0, 100)}</div>
          </div>
          <div className="x:flex x:flex-shrink-0 x:items-center x:gap-1">
            {modelSelection && (
              <div
                className={
                  "x:flex x:flex-shrink-0 x:items-center x:gap-1 x:rounded-md x:border x:border-border/50 x:bg-secondary x:px-2 x:py-1 x:text-xs x:text-muted-foreground"
                }
              >
                <AtomicSimple className="x:!size-3" />
                <span>
                  {
                    PplxLanguageModelsService.allModels.find(
                      (model) => model.code === space.model_selection,
                    )?.label
                  }
                </span>
              </div>
            )}
            {useDebounce(isHighlighted, 300) && (
              <AdditionalInfos space={space} />
            )}
          </div>
        </div>
        {isHighlighted && (space.description || space.instructions) && (
          <div className="x:flex x:max-w-full x:flex-col x:gap-1 x:rounded-md x:border x:border-border/50 x:bg-background x:p-2">
            {space.description && (
              <div className="x:flex x:items-baseline x:gap-1">
                <div className="x:text-xs x:font-medium">
                  {t(
                    "plugin-command-menu:commandMenu.spaceSearch.spaceItem.details.description",
                  )}
                </div>
                <div className="x:line-clamp-2 x:text-xs x:text-foreground">
                  {space.description}
                </div>
              </div>
            )}
            {space.instructions && (
              <div className="x:flex x:items-baseline x:gap-1">
                <div className="x:text-xs x:font-medium">
                  {t(
                    "plugin-command-menu:commandMenu.spaceSearch.spaceItem.details.instructions",
                  )}
                </div>
                <div className="x:line-clamp-2 x:text-xs x:text-foreground">
                  {space.instructions}
                </div>
              </div>
            )}
          </div>
        )}
        {isHighlighted && (
          <div className="x:flex x:items-center x:justify-end x:gap-2 x:text-xs x:text-muted-foreground">
            <KeyCombo keys={["shift", "enter"]} />
            <span>
              {t(
                "plugin-command-menu:commandMenu.spaceSearch.spaceItem.searchHint",
              )}
            </span>
          </div>
        )}
      </a>
    </CommandItem>
  );
}
