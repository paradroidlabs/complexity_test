import { useRoutes } from "react-router-dom";

import PluginSettingsWrapper from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/PluginSettingsWrapper";
import IndexPage from "@/entrypoints/options-page/dashboard/pages/plugins/IndexPage";

export function PluginPageRoutes() {
  return useRoutes([
    {
      path: ":pluginId/*",
      element: <PluginSettingsWrapper />,
    },
    {
      index: true,
      element: <IndexPage />,
    },
  ]);
}
