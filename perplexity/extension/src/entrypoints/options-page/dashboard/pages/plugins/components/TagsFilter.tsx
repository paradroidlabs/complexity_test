import type { PopoverOpenChangeDetails } from "@ark-ui/react";
import { LuMinus, LuPlus } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { Command, CommandList, CommandItem } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  PLUGIN_TAGS,
  type PluginTagValues,
} from "@/data/plugin-registry/plugin-tags";
import { usePluginFiltersStore } from "@/entrypoints/options-page/dashboard/pages/plugins/store";

export function TagsFilter() {
  const filters = usePluginFiltersStore((state) => state.filters);
  const setFilters = usePluginFiltersStore((state) => state.setFilters);
  const [open, setOpen] = useState(false);

  const handleSelect = (tag: PluginTagValues) => {
    const currentTags = filters.tags;
    const currentExcludeTags = filters.excludeTags;

    // Cycle through states
    if (!currentTags.includes(tag) && !currentExcludeTags.includes(tag)) {
      setFilters({
        ...filters,
        tags: [...currentTags, tag],
      });
    } else if (currentTags.includes(tag)) {
      setFilters({
        ...filters,
        tags: currentTags.filter((t) => t !== tag),
        excludeTags: [...currentExcludeTags, tag],
      });
    } else {
      setFilters({
        ...filters,
        excludeTags: currentExcludeTags.filter((t) => t !== tag),
      });
    }
  };

  const handleOpenChange = (details: PopoverOpenChangeDetails) => {
    setOpen(details.open);
  };

  const getTagState = (
    tag: PluginTagValues,
  ): "include" | "exclude" | "none" => {
    if (filters.tags.includes(tag)) return "include";
    if (filters.excludeTags.includes(tag)) return "exclude";
    return "none";
  };

  const getActiveFiltersCount = () =>
    filters.tags.length + filters.excludeTags.length;

  return (
    <div className="x:flex x:flex-col x:gap-2">
      <Popover
        open={open}
        positioning={{
          placement: "bottom-end",
        }}
        onOpenChange={handleOpenChange}
      >
        <PopoverTrigger asChild>
          <Button variant="ghost" className="x:py-2">
            <div className="x:flex x:items-center x:gap-2">
              <span>Tags</span>
              {getActiveFiltersCount() > 0 && (
                <div className="x:flex x:h-4 x:w-4 x:items-center x:justify-center x:rounded-full x:bg-primary/10 x:text-[10px] x:font-medium x:text-primary">
                  {getActiveFiltersCount()}
                </div>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="x:w-[230px] x:p-0">
          <Command>
            <CommandList className="x:p-3 x:shadow-lg x:[&_[cmdk-list-sizer]]:flex x:[&_[cmdk-list-sizer]]:flex-row x:[&_[cmdk-list-sizer]]:flex-wrap">
              {Object.entries(PLUGIN_TAGS).map(
                ([key, { label, description }]) => {
                  const tagState = getTagState(key as PluginTagValues);
                  return (
                    <Tooltip key={key} content={description}>
                      <CommandItem
                        className={cn({
                          "x:m-1 x:w-max x:cursor-pointer x:rounded-md x:px-2 x:py-0.5 x:text-sm x:transition-colors x:hover:bg-primary/10 x:aria-selected:bg-secondary x:aria-selected:text-muted-foreground":
                            true,
                          "x:bg-primary x:text-primary-foreground x:aria-selected:bg-primary x:aria-selected:text-primary-foreground":
                            tagState === "include",
                          "x:bg-destructive x:text-destructive-foreground x:aria-selected:bg-destructive x:aria-selected:text-destructive-foreground":
                            tagState === "exclude",
                          "x:bg-secondary": tagState === "none",
                        })}
                        onSelect={() => handleSelect(key as PluginTagValues)}
                      >
                        {tagState === "include" ? (
                          <span className="x:flex x:items-center x:gap-1">
                            <LuPlus className="x:h-3 x:w-3" />
                            {label}
                          </span>
                        ) : tagState === "exclude" ? (
                          <span className="x:flex x:items-center x:gap-1">
                            <LuMinus className="x:h-3 x:w-3" />
                            {label}
                          </span>
                        ) : (
                          label
                        )}
                      </CommandItem>
                    </Tooltip>
                  );
                },
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
