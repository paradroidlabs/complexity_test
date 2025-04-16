import { type ZodSchema } from "zod";

import type {
  PluginManifest,
  PluginsSettingsSchema,
  TypedPluginManifest,
} from "@/data/plugin-registry/types";

export type DefinePluginParams<T extends PluginManifest["id"]> = {
  manifest: TypedPluginManifest<T>;
  settingsSchema: {
    schema: ZodSchema;
    fallback: PluginsSettingsSchema[T];
  };
};

export const definePlugin = <T extends PluginManifest["id"]>(
  params: DefinePluginParams<T>,
) => {
  return params;
};
