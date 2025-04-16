/**
 * ⚠️ IMPORTANT ⚠️
 *
 * This file should NOT contain any dynamic imports.
 * All imports must be static to ensure proper bundling and initialization.
 * Dynamic imports in this file can cause plugin registration issues and
 * lead to unpredictable behavior across different extension contexts.
 */

import { z } from "zod";

import type {
  PluginId,
  PluginManifestsMap,
  PluginsSettingsRegistry,
  PluginsSettingsSchema,
  TypedPluginManifest,
} from "@/data/plugin-registry/types";
import type { DefinePluginParams } from "@/data/plugin-registry/utils";
import { invariant } from "@/utils/utils";

export class PluginRegistry {
  static manifests: PluginManifestsMap = {} as PluginManifestsMap;
  static zodSchema = z.object({});
  static fallbackValues = {} as PluginsSettingsSchema;
}

(() => {
  const entries = import.meta.glob("@/plugins/!(_core|_api)/index.ts", {
    eager: true,
  }) as Record<string, Record<string, unknown>>;

  for (const [path, module] of Object.entries(entries)) {
    invariant("default" in module, `Plugin "${path}" has no default export`);

    const params = module.default as DefinePluginParams<
      keyof PluginsSettingsRegistry
    >;

    invariant(params != null, `Plugin "${path}" has no definition`);

    (PluginRegistry.manifests[params.manifest.id] as TypedPluginManifest<
      keyof PluginsSettingsRegistry
    >) = params.manifest;

    PluginRegistry.zodSchema = PluginRegistry.zodSchema.extend({
      [params.manifest.id]: params.settingsSchema.schema,
    });
    (PluginRegistry.fallbackValues[
      params.manifest.id
    ] as PluginsSettingsSchema[PluginId]) = params.settingsSchema.fallback;
  }
})();
