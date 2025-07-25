import { PluginsFilter } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugins-filter";
import { PluginSections } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginSections";
import { SearchInput } from "@/entrypoints/options-page/dashboard/pages/plugins/components/SearchInput";
import { useFilteredPlugins } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/useFilteredPlugins";
import { usePluginCategories } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginCategories";
import { usePluginFilters } from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginFilters";
import PluginsEnableSet from "@/entrypoints/options-page/dashboard/pages/plugins/PluginsEnableSet";

export default function IndexPage() {
  const { filters } = usePluginFilters();

  const filteredPluginIds = useFilteredPlugins({
    searchTerm: filters.searchTerm,
    selectedTags: filters.tags,
    excludeTags: filters.excludeTags,
    categories: filters.categories,
  });

  const { pluginsByCategory } = usePluginCategories({
    filteredPluginIds,
  });

  return (
    <div className="x:flex x:size-full x:flex-col x:gap-4 x:md:mt-0">
      <div className="x:flex x:flex-col x:items-center x:justify-between x:md:flex-row">
        <div className="x:text-center x:text-sm x:text-balance x:text-muted-foreground x:md:text-left">
          A full page reload on Perplexity.ai is required when changing plugin
          settings.
        </div>
        <PluginsEnableSet />
      </div>

      <div className="x:flex x:w-full x:gap-2 x:md:w-md">
        <SearchInput />
        <PluginsFilter />
      </div>

      <PluginSections pluginsByCategory={pluginsByCategory} />
    </div>
  );
}
