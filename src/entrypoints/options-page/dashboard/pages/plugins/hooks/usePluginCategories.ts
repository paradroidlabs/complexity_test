import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import { PLUGIN_CATEGORIES } from "@/data/plugins-data/plugins-tags";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

export function usePluginCategories({
  filteredPluginIds,
}: {
  filteredPluginIds: PluginId[];
}) {
  return useMemo(() => {
    const pluginsByCategory: Record<string, PluginId[]> = {};

    Object.keys(PLUGIN_CATEGORIES).forEach((category) => {
      pluginsByCategory[category] = [];
    });

    filteredPluginIds.forEach((pluginId) => {
      const plugin = PLUGINS_METADATA[pluginId];
      plugin.categories.forEach((category) => {
        if (!pluginsByCategory[category]) {
          pluginsByCategory[category] = [];
        }
        pluginsByCategory[category].push(pluginId);
      });
    });

    const nonEmptyCategories = Object.fromEntries(
      Object.entries(pluginsByCategory).filter(([, ids]) => ids.length > 0),
    );

    return {
      pluginsByCategory: nonEmptyCategories,
    };
  }, [filteredPluginIds]);
}
