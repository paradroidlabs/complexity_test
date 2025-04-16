import { LuChevronLeft } from "react-icons/lu";
import { Link } from "react-router-dom";

import { PluginRegistry } from "@/data/plugin-registry/index";
import { PLUGIN_SETTINGS_UIS } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/loader";

type PluginSettingsPageProps = {
  pluginRouteSegment: string;
};

export default function PluginSettingsPage({
  pluginRouteSegment,
}: PluginSettingsPageProps) {
  const plugin = Object.values(PluginRegistry.manifests).find(
    (plugin) => plugin.settingsUiRouteSegment === pluginRouteSegment,
  );

  const dialogContent = plugin ? PLUGIN_SETTINGS_UIS[plugin.id] : null;

  if (!plugin) return null;

  return (
    <div className="x:space-y-6">
      <Link
        to="/plugins"
        className="x:mb-4 x:flex x:items-center x:gap-2 x:text-muted-foreground x:transition x:hover:text-foreground"
      >
        <LuChevronLeft />
        Back to plugins
      </Link>
      <div>
        <h1 className="x:text-2xl x:font-bold">{plugin.title}</h1>
        <p className="x:mt-2 x:text-muted-foreground">{plugin.description}</p>
      </div>
      {dialogContent}
    </div>
  );
}
