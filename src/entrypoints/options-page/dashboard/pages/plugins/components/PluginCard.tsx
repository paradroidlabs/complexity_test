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
import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import { PLUGIN_TAGS } from "@/data/plugins-data/plugins-tags";
import { PLUGIN_DETAILS } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-details/plugins-details";
import usePluginsStates from "@/entrypoints/options-page/dashboard/pages/plugins/hooks/usePluginsStates";
import { PluginId } from "@/services/extension-local-storage/plugins.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

type PluginCardProps = {
  pluginId: PluginId;
  isForceDisabled: boolean;
};

export function PluginCard({ pluginId, isForceDisabled }: PluginCardProps) {
  const navigate = useNavigate();

  const { settings, mutation } = useExtensionLocalStorage();

  const { title, description, tags, routeSegment } = PLUGINS_METADATA[pluginId];

  const dialogContent = PLUGIN_DETAILS[pluginId];

  const { pluginsStates } = usePluginsStates();

  const areAllDependentPluginsEnabled = useMemo(
    () =>
      PLUGINS_METADATA?.[pluginId]?.dependentPlugins?.every(
        (dependentPluginId) => settings?.plugins[dependentPluginId].enabled,
      ) ?? true,
    [pluginId, settings],
  );

  const areAnyDependentPluginsDisabled = useMemo(
    () =>
      PLUGINS_METADATA?.[pluginId]?.dependentPlugins?.some(
        (dependentPluginId) =>
          pluginsStates[dependentPluginId].isOnMaintenance ||
          pluginsStates[dependentPluginId].isOutdated,
      ) ?? false,
    [pluginId, pluginsStates],
  );

  if (!settings) return null;

  return (
    <Card className="x-flex x-h-full x-flex-col x-bg-secondary">
      <CardHeader className="x-flex x-flex-row x-items-start x-justify-between x-space-y-0">
        <div>
          <CardTitle>
            <span className="x-text-lg">{title}</span>
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>
      {tags != null && tags.length > 0 && (
        <CardContent>
          <div className="x-flex x-flex-wrap x-gap-2">
            {tags.map((tag) => (
              <Tooltip key={tag} content={PLUGIN_TAGS[tag].description}>
                <Badge
                  variant="secondary"
                  className={cn(
                    "x-border x-border-border/50 hover:x-bg-background",
                    {
                      "x-bg-destructive x-text-destructive-foreground hover:x-bg-destructive/80":
                        tag === "experimental",
                      "x-bg-primary x-text-primary-foreground hover:x-bg-primary/80":
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
      <CardFooter className="x-mt-auto x-flex x-justify-between">
        <div className="x-flex x-gap-2">
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
                    {PLUGINS_METADATA[pluginId]?.dependentPlugins?.map(
                      (dependentPluginId) => (
                        <li key={dependentPluginId}>
                          {PLUGINS_METADATA[dependentPluginId]?.title}
                        </li>
                      ),
                    )}
                  </Ul>
                </div>
              }
            >
              <LuTriangleAlert className="x-size-4 x-text-yellow-300 dark:x-text-yellow-500" />
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
            <LuTriangleAlert className="x-size-4 x-text-destructive" />
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
