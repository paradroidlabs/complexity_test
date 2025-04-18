import semver from "semver";

import { PluginRegistry } from "@/data/plugin-registry/index";
import type { PluginId } from "@/data/plugin-registry/types";
import type { FeatureCompatibility } from "@/services/cplx-api/cplx-api.types";
import type { ExtensionSettings } from "@/services/extension-settings/types";

export type PluginState = {
  isOutdated: boolean;
  isOnMaintenance: boolean; // if no publicly available newer version
};

export type PluginsStates = Record<PluginId, PluginState>;

export const initializePluginStates = (): PluginsStates => {
  return (Object.keys(PluginRegistry.manifests) as PluginId[]).reduce(
    (acc, pluginId) => ({
      ...acc,
      [pluginId]: {
        isOutdated: false,
        isOnMaintenance: false,
      } satisfies PluginState,
    }),
    {} as PluginsStates,
  );
};

export const isPluginOutdated = (
  currentVersion: string,
  requiredVersion: string | undefined,
): boolean => {
  if (!requiredVersion) return true;
  return semver.lt(
    semver.coerce(currentVersion)!,
    semver.coerce(requiredVersion)!,
  );
};

export const isUpdateAvail = (
  requiredVersion: string | undefined,
  latestAvailableVersion: string | undefined,
): boolean => {
  if (!requiredVersion || !latestAvailableVersion) return false;
  return semver.gt(
    semver.coerce(latestAvailableVersion)!,
    semver.coerce(requiredVersion)!,
  );
};

export const updatePluginStatesWithFeatureCompat = (
  pluginsStates: PluginsStates,
  featureCompat: FeatureCompatibility | undefined,
  currentVersion: string,
  latestAvailableVersion: string | undefined,
): PluginsStates => {
  if (!featureCompat) return pluginsStates;

  return Object.keys(pluginsStates).reduce(
    (acc, pluginId) => {
      const isOutdated = isPluginOutdated(
        currentVersion,
        featureCompat[pluginId as PluginId],
      );

      return {
        ...acc,
        [pluginId as PluginId]: {
          ...pluginsStates[pluginId as PluginId],
          isOutdated,
          isOnMaintenance:
            isOutdated &&
            !isUpdateAvail(currentVersion, latestAvailableVersion),
        },
      };
    },

    { ...pluginsStates },
  );
};

export const getEnableStates = (
  pluginsStates: PluginsStates,
  localEnableStates: ExtensionSettings["plugins"],
): Record<PluginId, boolean> => {
  return Object.keys(pluginsStates).reduce(
    (acc, pluginId) => ({
      ...acc,
      [pluginId as PluginId]:
        areAllDependenciesAvailable(pluginId as PluginId, pluginsStates) &&
        !isPluginLockedDown(pluginsStates, pluginId as PluginId) &&
        localEnableStates[pluginId as PluginId].enabled,
    }),
    {} as Record<PluginId, boolean>,
  );
};

function areAllDependenciesAvailable(
  pluginId: PluginId,
  pluginsStates: PluginsStates,
) {
  if (!PluginRegistry.manifests[pluginId]?.dependentPlugins) return true;

  return PluginRegistry.manifests[pluginId]?.dependentPlugins?.every(
    (dependentPluginId) =>
      !pluginsStates[dependentPluginId].isOnMaintenance &&
      !pluginsStates[dependentPluginId].isOutdated,
  );
}

function isPluginLockedDown(pluginsStates: PluginsStates, pluginId: PluginId) {
  return (
    pluginsStates[pluginId].isOutdated ||
    pluginsStates[pluginId].isOnMaintenance
  );
}
