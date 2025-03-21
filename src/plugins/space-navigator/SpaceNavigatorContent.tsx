import { useQuery } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import SpaceItem from "@/plugins/space-navigator/query-box/SpaceItem";
import SpaceItemPreview from "@/plugins/space-navigator/sidebar-content/SpaceItemPreview";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";
import { UiUtils } from "@/utils/ui-utils";

export default function SpaceNavigatorContent({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { isMobile } = useIsMobileStore();

  const { data: spaces, isLoading } = useQuery(pplxApiQueries.spaces);

  const [searchValue, setSearchValue] = useState("");

  return (
    <Command
      filter={(value, search, keywords) => {
        const extendValue =
          value + (keywords?.join("") ?? "").replace(/\s+/g, "").toLowerCase();

        const normalizedSearch = search.replace(/\s+/g, "").toLowerCase();

        if (extendValue.includes(normalizedSearch)) return 1;
        return 0;
      }}
      onKeyDown={(event) => {
        if (event.key === Key.Escape) {
          event.preventDefault();
          event.stopPropagation();

          setTimeout(() => {
            UiUtils.getActiveQueryBoxTextarea().trigger("focus");
          }, 100);
        }
      }}
      className="x:rounded-xl"
    >
      <CommandInput
        placeholder={t(
          "plugin-space-navigator:spaceNavigator.search.placeholder",
        )}
        value={searchValue}
        className={cn({
          "x:font-medium": !searchValue,
        })}
        searchIcon={false}
        onValueChange={(value) => setSearchValue(value)}
      />
      {!isLoading && (
        <CommandEmpty>
          {t("plugin-space-navigator:spaceNavigator.search.noResults")}
        </CommandEmpty>
      )}
      <div className="x:flex x:items-start">
        <CommandList className="x:flex-1 x:p-1">
          {isLoading ? (
            <div className="x:my-10 x:w-full x:space-x-2 x:text-center">
              <LuLoaderCircle className="x:inline-block x:size-4 x:animate-spin" />
              <span>{t("plugin-space-navigator:spaceNavigator.loading")}</span>
            </div>
          ) : (
            <CommandGroup>
              {spaces?.map((space) => (
                <SpaceItem key={space.uuid} space={space} setOpen={setOpen} />
              ))}
            </CommandGroup>
          )}
        </CommandList>
        {!isMobile && !isLoading && spaces && (
          <div
            className={cn(
              PPLX_SCROLLBAR_CLASSES,
              "x:h-[300px] x:overflow-auto x:sm:w-[300px] x:lg:w-[400px] x:xl:w-[500px]",
            )}
          >
            <SpaceItemPreview spaces={spaces} />
          </div>
        )}
      </div>
    </Command>
  );
}
