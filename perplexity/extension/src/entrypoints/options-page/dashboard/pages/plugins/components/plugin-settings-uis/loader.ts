import React from "react";

import type { PluginId } from "@/data/plugin-registry/types";
import { invariant } from "@/utils/utils";

export type PluginSettingsUIs = Partial<Record<PluginId, React.ReactNode>>;

export const PLUGIN_SETTINGS_UIS: PluginSettingsUIs = (() => {
  const settingsUis: PluginSettingsUIs = {};

  const entries = import.meta.glob("@/plugins/!(_core|_api)/settings-ui.tsx", {
    eager: true,
  }) as Record<
    string,
    {
      default?: React.ComponentType;
      pluginId?: PluginId;
    }
  >;

  for (const [_, module] of Object.entries(entries)) {
    invariant(
      module.default != null,
      `Plugin settings UI for "${module.pluginId}" is declared but missing default export`,
    );

    invariant(
      module.pluginId != null,
      `Plugin settings UI for "${module.pluginId}" is declared but missing \`pluginId\` export`,
    );

    settingsUis[module.pluginId] = React.createElement(module.default);
  }

  return settingsUis;
})();
