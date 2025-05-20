import { Tabs, TabContent, TabsList, TabTrigger } from "@/components/ui/tabs";
import { H2 } from "@/components/ui/typography";
import {
  PLUGIN_CATEGORIES,
  type PluginCategory,
} from "@/data/plugin-registry/plugin-tags";
import type { PluginId } from "@/data/plugin-registry/types";
import NoPluginsFound from "@/entrypoints/options-page/dashboard/pages/plugins/components/NoPluginsFound";
import { PluginsGrid } from "@/entrypoints/options-page/dashboard/pages/plugins/components/PluginsGrid";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

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
  const categories = Object.keys(pluginsByCategory);

  return (
    <Tabs defaultValue={categories[0]} activationMode="automatic">
      <TabsList className="x:mx-auto x:flex x:w-full x:max-w-fit x:flex-nowrap x:overflow-x-auto x:rounded-lg x:border x:bg-secondary">
        {categories.map((category) => (
          <TabTrigger
            key={category}
            value={category}
            className="x:whitespace-nowrap"
          >
            {PLUGIN_CATEGORIES[category as PluginCategory]?.label || category}
          </TabTrigger>
        ))}
      </TabsList>
      {Object.entries(pluginsByCategory).map(([category, pluginIds]) => (
        <TabContent key={category} value={category} className="x:mt-4">
          <PluginsGrid pluginIds={pluginIds} />
        </TabContent>
      ))}
    </Tabs>
  );
}

function DesktopPluginSections({ pluginsByCategory }: PluginSectionsProps) {
  return (
    <div className="x:flex x:flex-col x:gap-8">
      {Object.entries(pluginsByCategory).map(([category, pluginIds]) => (
        <section key={category}>
          <H2 className="x:!text-lg x:font-semibold">
            {PLUGIN_CATEGORIES[category as PluginCategory]?.label || category}
          </H2>
          {!!PLUGIN_CATEGORIES[category as PluginCategory]?.description && (
            <div className="x:mb-4 x:text-sm x:text-muted-foreground">
              {PLUGIN_CATEGORIES[category as PluginCategory].description}
            </div>
          )}
          <PluginsGrid pluginIds={pluginIds} />
        </section>
      ))}
    </div>
  );
}
