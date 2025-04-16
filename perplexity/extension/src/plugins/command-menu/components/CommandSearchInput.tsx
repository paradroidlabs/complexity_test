import { CommandInput } from "@/components/ui/command";
import { SEARCH_FILTERS } from "@/data/plugins/command-menu/items";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import SearchFilterBadge from "@/plugins/command-menu/components/SearchFilterBadge";

export const CommandSearchInput = memo(function CommandSearchInput() {
  const { searchValue, setSearchValue, filter, setFilter, setInputRef, open } =
    useCommandMenuStore((state) => ({
      searchValue: state.searchValue,
      setSearchValue: state.setSearchValue,
      filter: state.filter,
      setFilter: state.setFilter,
      setInputRef: state.setInputRef,
      open: state.open,
    }));

  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setInputRef(ref);
    }
  }, [open, setInputRef]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && searchValue.length === 0) {
      setFilter(null);
    }
  };

  const inputClassName = cn("x:grow x:border-none", {
    "x:font-medium": !searchValue,
  });

  return (
    <div className="x:flex x:items-center x:border-b x:border-border/50">
      <SearchFilterBadge />
      <CommandInput
        ref={ref}
        className={inputClassName}
        placeholder={
          !filter
            ? t("plugin-command-menu:commandMenu.input.placeholder")
            : SEARCH_FILTERS[filter].searchPlaceholder
        }
        searchIcon={false}
        value={searchValue}
        onValueChange={setSearchValue}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
});
