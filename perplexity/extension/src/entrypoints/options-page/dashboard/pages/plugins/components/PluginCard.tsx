import { LuTriangleAlert } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import Tooltip from "@/components/Tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
  CardContent,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Ul } from "@/components/ui/typography";
import { PluginRegistry } from "@/data/plugin-registry/index";
import { PLUGIN_TAGS } from "@/data/plugin-registry/plugin-tags";
import type { PluginId } from "@/data/plugin-registry/types";
import { PLUGIN_SETTINGS_UIS } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/loader";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

type PluginCardProps = {
  pluginId: PluginId;
  isForceDisabled: boolean;
};

export function PluginCard({ pluginId, isForceDisabled }: PluginCardProps) {
  const navigate = useNavigate();

  const { settings, mutation } = useExtensionSettings();

  const {
    title,
    description,
    tags,
    settingsUiRouteSegment: routeSegment,
  } = PluginRegistry.manifests[pluginId];

  const dialogContent = PLUGIN_SETTINGS_UIS[pluginId];

  const { pluginsStates } = usePluginsStates();

  const areAllDependentPluginsEnabled = useMemo(
    () =>
      PluginRegistry.manifests?.[pluginId]?.dependentPlugins?.every(
        (dependentPluginId) => settings?.plugins[dependentPluginId].enabled,
      ) ?? true,
    [pluginId, settings],
  );

  const areAnyDependentPluginsDisabled = useMemo(
    () =>
      PluginRegistry.manifests?.[pluginId]?.dependentPlugins?.some(
        (dependentPluginId) =>
          pluginsStates[dependentPluginId].isOnMaintenance ||
          pluginsStates[dependentPluginId].isOutdated,
      ) ?? false,
    [pluginId, pluginsStates],
  );

  if (!settings) return null;

  return (
    <Card className="x:flex x:h-full x:flex-col x:bg-secondary">
      <CardHeader className="x:flex x:flex-row x:items-start x:justify-between x:space-y-0">
        <div>
          <CardTitle>
            <span className="x:text-lg">{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      {tags != null && tags.length > 0 && (
        <CardContent>
          <div className="x:flex x:flex-wrap x:gap-2">
            {tags.map((tag) => (
              <Tooltip key={tag} content={PLUGIN_TAGS[tag].description}>
                <Badge
                  variant="secondary"
                  className={cn(
                    "x:border x:border-border/50 x:hover:bg-background",
                    {
                      "x:bg-destructive x:text-destructive-foreground x:hover:bg-destructive/80":
                        tag === "experimental",
                      "x:bg-primary x:text-primary-foreground x:hover:bg-primary/80":
                        tag === "new",
                    },
                  )}
                >
                  {PLUGIN_TAGS[tag].label.toLocaleUpperCase()}
                </Badge>
              </Tooltip>
            ))}
          </div>
        </CardContent>
      )}
      <CardFooter className="x:mt-auto x:flex x:justify-between">
        <div className="x:flex x:gap-2">
          {dialogContent != null && (
            <Button
              onClick={() =>
                navigate(`/plugins/${routeSegment}`, {
                  state: {
                    fromPluginList: true,
                  },
                })
              }
            >
              Details
            </Button>
          )}
        </div>

        {settings?.plugins[pluginId].enabled &&
          !areAllDependentPluginsEnabled && (
            <Tooltip
              content={
                <div>
                  <div>
                    One or more dependencies are disabled, please enable them to
                    use this plugin:
                  </div>
                  <Ul>
                    {PluginRegistry.manifests[pluginId]?.dependentPlugins?.map(
                      (dependentPluginId) => (
                        <li key={dependentPluginId}>
                          {PluginRegistry.manifests[dependentPluginId]?.title}
                        </li>
                      ),
                    )}
                  </Ul>
                </div>
              }
            >
              <LuTriangleAlert className="x:size-4 x:text-yellow-300 x:dark:text-yellow-500" />
            </Tooltip>
          )}

        {areAnyDependentPluginsDisabled && (
          <Tooltip
            content={
              <div>
                This plugin is disabled because one or more of its dependencies
                are not available.
              </div>
            }
          >
            <LuTriangleAlert className="x:size-4 x:text-destructive" />
          </Tooltip>
        )}

        {!isForceDisabled && (
          <Switch
            checked={settings?.plugins[pluginId].enabled ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins[pluginId].enabled = checked;
              });
            }}
          />
        )}
      </CardFooter>
    </Card>
  );
}
