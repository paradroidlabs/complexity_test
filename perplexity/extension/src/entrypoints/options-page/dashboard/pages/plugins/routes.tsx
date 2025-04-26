import { useRoutes } from "react-router-dom";

import PluginSettingsWrapper from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/PluginSettingsWrapper";
import PluginsListing from "@/entrypoints/options-page/dashboard/pages/plugins/PluginsListing";

export function PluginRoutes() {
  return useRoutes([
    {
      path: ":pluginId/*",
      element: <PluginSettingsWrapper />,
    },
    {
      path: "*",
      element: <PluginsListing />,
    },
  ]);
}
