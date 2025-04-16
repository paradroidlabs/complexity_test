import type { PluginId } from "@/data/plugin-registry/types";
import { PluginCard } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginCard";
import { PluginLockDownOverlay } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginLockDownOverlay";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import type { PluginsStates } from "@/services/plugins-states/utils";

type PluginGridProps = {
  pluginIds: PluginId[];
};

export function PluginsGrid({ pluginIds }: PluginGridProps) {
  const { pluginsStates } = usePluginsStates();

  return (
    <div className="x:grid x:gap-4 x:sm:grid-cols-2 x:xl:grid-cols-3 x:2xl:grid-cols-4">
      {pluginIds.map((pluginId) => {
        const isLockedDown =
          pluginsStates[pluginId].isOutdated ||
          pluginsStates[pluginId].isOnMaintenance;

        return (
          <div key={pluginId} className="x:relative">
            <PluginCard pluginId={pluginId} isForceDisabled={isLockedDown} />
            {isLockedDown && (
              <PluginLockDownOverlay
                text={getLockdownText(pluginId, pluginsStates)}
                subText={getLockdownSubText(pluginId, pluginsStates)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function getLockdownText(pluginId: PluginId, pluginsStates: PluginsStates) {
  const { isOutdated, isOnMaintenance } = pluginsStates[pluginId];

  if (isOnMaintenance) return "This plugin is on maintenance";
  if (isOutdated) return "This plugin is outdated";

  return "";
}

function getLockdownSubText(pluginId: PluginId, pluginsStates: PluginsStates) {
  const { isOutdated, isOnMaintenance } = pluginsStates[pluginId];

  if (isOnMaintenance) return "Please check back later";
  if (isOutdated) return "Please update the extension";

  return "";
}
