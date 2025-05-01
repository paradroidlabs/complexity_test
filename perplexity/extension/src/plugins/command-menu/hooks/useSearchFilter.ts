import { DISABLE_LOCAL_FILTER_SEARCH_FILTERS } from "@/plugins/command-menu/public/items";
import { useCommandMenuStore } from "@/plugins/command-menu/public/store";

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
