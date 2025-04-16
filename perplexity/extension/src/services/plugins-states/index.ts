import { APP_CONFIG } from "@/app.config";
import type { PluginId } from "@/data/plugin-registry/types";
import type {
  CplxVersions,
  FeatureCompatibility,
} from "@/services/cplx-api/cplx-api.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { ExtensionSettingsService } from "@/services/extension-settings";
import {
  initializePluginStates,
  getEnableStates,
  updatePluginStatesWithFeatureCompat,
} from "@/services/plugins-states/utils";
import { queryClient } from "@/utils/ts-query-client";
import { invariant } from "@/utils/utils";

export class PluginsStatesService {
  static cachedEnableStates: Record<PluginId, boolean> | null = null;

  static getEnableStatesCachedSync(): Record<PluginId, boolean> {
    if (this.cachedEnableStates) return this.cachedEnableStates;

    const featureCompat = queryClient.getQueryData<FeatureCompatibility>(
      cplxApiQueries.featureCompat.queryKey,
    );

    const cplxVersions = queryClient.getQueryData<CplxVersions>(
      cplxApiQueries.versions.queryKey,
    );

    const pluginsStates = initializePluginStates();

    const withFeatureCompat = updatePluginStatesWithFeatureCompat(
      pluginsStates,
      featureCompat,
      APP_CONFIG.VERSION,
      cplxVersions?.latest,
    );

    const enableStates = getEnableStates(
      withFeatureCompat,
      ExtensionSettingsService.cachedSync.plugins,
    );

    invariant(
      featureCompat && cplxVersions,
      "[PluginsStatesService] Missing required data",
    );

    this.cachedEnableStates = enableStates;

    return enableStates;
  }
}
