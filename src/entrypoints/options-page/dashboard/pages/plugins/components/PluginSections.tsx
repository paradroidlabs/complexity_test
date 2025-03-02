import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { H2 } from "@/components/ui/typography";
import {
  PLUGIN_CATEGORIES,
  PluginCategory,
} from "@/data/plugins-data/plugins-tags";
import NoPluginsFound from "@/entrypoints/options-page/dashboard/pages/plugins/components/NoPluginsFound";
import { PluginsGrid } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginsGrid";
import PluginsEnableSet from "@/entrypoints/options-page/dashboard/pages/plugins/PluginsEnableSet";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { PluginId } from "@/services/extension-local-storage/plugins.types";

type PluginSectionsProps = {
  pluginsByCategory: Record<string, PluginId[]>;
};

export function PluginSections({ pluginsByCategory }: PluginSectionsProps) {
  const { isMobile } = useIsMobileStore();

  const allPluginsCount = Object.values(pluginsByCategory).reduce(
    (acc, plugins) => acc + plugins.length,
    0,
  );

  if (allPluginsCount === 0) {
    return <NoPluginsFound />;
  }

  return isMobile ? (
    <MobilePluginSections pluginsByCategory={pluginsByCategory} />
  ) : (
    <DesktopPluginSections pluginsByCategory={pluginsByCategory} />
  );
}

function MobilePluginSections({ pluginsByCategory }: PluginSectionsProps) {
  return (
    <div className="x-flex x-flex-col">
      <PluginsEnableSet />
      <Tabs defaultValue="queryBox">
        <TabsList className="x-w-full">
          {Object.keys(pluginsByCategory).map((category) => (
            <TabsTrigger key={category} value={category}>
              {PLUGIN_CATEGORIES[category as PluginCategory]?.label || category}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(pluginsByCategory).map(([category, pluginIds]) => (
          <TabsContent key={category} value={category} className="x-mt-4">
            <PluginsGrid pluginIds={pluginIds} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function DesktopPluginSections({ pluginsByCategory }: PluginSectionsProps) {
  return (
    <div className="x-flex x-flex-col x-gap-8">
      <div className="x-flex x-items-center x-justify-end x-gap-4">
        <PluginsEnableSet />
      </div>

      {Object.entries(pluginsByCategory).map(([category, pluginIds]) => (
        <section key={category}>
          <H2 className="!x-text-lg x-font-semibold">
            {PLUGIN_CATEGORIES[category as PluginCategory]?.label || category}
          </H2>
          {!!PLUGIN_CATEGORIES[category as PluginCategory]?.description && (
            <div className="x-mb-4 x-text-sm x-text-muted-foreground">
              {PLUGIN_CATEGORIES[category as PluginCategory].description}
            </div>
          )}
          <PluginsGrid pluginIds={pluginIds} />
        </section>
      ))}
    </div>
  );
}
