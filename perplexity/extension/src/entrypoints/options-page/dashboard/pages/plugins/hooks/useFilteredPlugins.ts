import { PluginRegistry } from "@/data/plugin-registry/index";
import type { PluginTagValues } from "@/data/plugin-registry/plugin-tags";

type UseFilteredPluginsParams = {
  searchTerm: string;
  selectedTags: PluginTagValues[];
  excludeTags: PluginTagValues[];
};

export function useFilteredPlugins({
  searchTerm,
  selectedTags,
  excludeTags,
}: UseFilteredPluginsParams) {
  const filteredPlugins = useMemo(() => {
    return Object.values(PluginRegistry.manifests)
      .filter((plugin) => {
        const matchesSearch = (plugin.title + plugin.description)
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const hasTags = plugin.tags !== undefined && plugin.tags.length > 0;

        const matchesTags =
          selectedTags.length === 0 ||
          (hasTags && selectedTags.every((tag) => plugin.tags!.includes(tag)));

        const hasExcludedTags =
          hasTags && excludeTags.some((tag) => plugin.tags!.includes(tag));

        return matchesSearch && matchesTags && !hasExcludedTags;
      })
      .map((plugin) => plugin.id);
  }, [excludeTags, searchTerm, selectedTags]);

  return filteredPlugins;
}
