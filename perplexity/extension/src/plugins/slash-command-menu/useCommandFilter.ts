import type { FilterMode } from "@/plugins/slash-command-menu/FilterItems";

export const useCommandFilter = () => {
  const shouldFilterItems = (filter: FilterMode | null): boolean => {
    const DONT_FILTER_MODES: FilterMode[] = ["promptHistory"];
    return !(filter && DONT_FILTER_MODES.includes(filter));
  };

  const calculateFilterScore = (
    value: string,
    search: string,
    keywords?: string[],
    filter?: FilterMode | null,
  ): number => {
    const shouldIncludeKeywords = filter == null && search.length <= 1;
    const extendValue = shouldIncludeKeywords
      ? value
      : value + (keywords?.join("") ?? "").replace(/\s+/g, "").toLowerCase();
    const normalizedSearch = search.replace(/\s+/g, "").toLowerCase();

    return extendValue.includes(normalizedSearch) ? 1 : 0;
  };

  return { shouldFilterItems, calculateFilterScore };
};
