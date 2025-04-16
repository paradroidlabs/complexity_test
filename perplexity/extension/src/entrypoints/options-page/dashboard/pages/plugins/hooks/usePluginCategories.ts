import { PluginRegistry } from "@/data/plugin-registry/index";
import { PLUGIN_CATEGORIES } from "@/data/plugin-registry/plugin-tags";
import type { PluginId } from "@/data/plugin-registry/types";

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
      const plugin = PluginRegistry.manifests[pluginId];
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
