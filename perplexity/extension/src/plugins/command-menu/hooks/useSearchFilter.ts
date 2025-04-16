import { DISABLE_LOCAL_FILTER_SEARCH_FILTERS } from "@/data/plugins/command-menu/items";
import { useCommandMenuStore } from "@/data/plugins/command-menu/store";

export function useSearchFilter() {
  const { searchValue, setSearchValue, filter, setFilter } =
    useCommandMenuStore();

  useEffect(() => {
    const handleSearchFilter = () => {
      if (searchValue.startsWith("thread")) {
        setFilter("threads");
        setSearchValue(searchValue.slice("thread".length));
        return;
      }

      if (searchValue.startsWith("space")) {
        setFilter("spaces");
        setSearchValue(searchValue.slice("space".length));
        return;
      }
    };

    handleSearchFilter();
  }, [searchValue, setFilter, setSearchValue]);

  return {
    shouldFilter:
      !filter || !DISABLE_LOCAL_FILTER_SEARCH_FILTERS.includes(filter),
  };
}
