import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Theme } from "@/data/plugins/themes/theme-registry.types";
import ThemeCard from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeCard/ThemeCard";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

type ThemeSectionsProps = {
  builtInThemes: Theme[];
  localThemes: Theme[];
};

export function ThemeSections({
  builtInThemes,
  localThemes,
}: ThemeSectionsProps) {
  const { isMobile } = useIsMobileStore();

  if (builtInThemes.length === 0 && localThemes.length === 0) {
    return <div>No themes found</div>;
  }

  return isMobile ? (
    <MobileThemeSections
      builtInThemes={builtInThemes}
      localThemes={localThemes}
    />
  ) : (
    <DesktopThemeSections
      builtInThemes={builtInThemes}
      localThemes={localThemes}
    />
  );
}

function ThemesGrid({
  themes,
  type,
}: {
  themes: Theme[];
  type: "local" | "built-in";
}) {
  return (
    <div className="x:grid x:grid-cols-1 x:gap-4 x:md:grid-cols-2 x:lg:grid-cols-3 x:xl:grid-cols-4">
      {themes.map((theme) => (
        <ThemeCard key={theme.id} theme={theme} type={type} />
      ))}
    </div>
  );
}

function MobileThemeSections({
  builtInThemes,
  localThemes,
}: ThemeSectionsProps) {
  const defaultTab = localThemes.length > 0 ? "local" : "built-in";

  return (
    <Tabs defaultValue={defaultTab}>
      <TabsList>
        {localThemes.length > 0 && (
          <TabsTrigger value="local">Local Themes</TabsTrigger>
        )}
        {builtInThemes.length > 0 && (
          <TabsTrigger value="built-in">Built-in Themes</TabsTrigger>
        )}
        <TabsTrigger value="community">Community Themes</TabsTrigger>
      </TabsList>

      {builtInThemes.length > 0 && (
        <TabsContent value="built-in" className="x:mt-4">
          <ThemesGrid themes={builtInThemes} type="built-in" />
        </TabsContent>
      )}

      {localThemes.length > 0 && (
        <TabsContent value="local" className="x:mt-4">
          <ThemesGrid themes={localThemes} type="local" />
        </TabsContent>
      )}

      <TabsContent value="community" className="x:mt-4">
        <div className="x:text-muted-foreground">Coming soon</div>
      </TabsContent>
    </Tabs>
  );
}

function DesktopThemeSections({
  builtInThemes,
  localThemes,
}: ThemeSectionsProps) {
  return (
    <div className="x:flex x:flex-col x:gap-8">
      {localThemes.length > 0 && (
        <section>
          <h2 className="x:mb-4 x:text-lg x:font-semibold">Local Themes</h2>
          <ThemesGrid themes={localThemes} type="local" />
        </section>
      )}

      {builtInThemes.length > 0 && (
        <section>
          <h2 className="x:mb-4 x:text-lg x:font-semibold">Built-in Themes</h2>
          <ThemesGrid themes={builtInThemes} type="built-in" />
        </section>
      )}

      <section>
        <h2 className="x:mb-4 x:text-lg x:font-semibold">Community Themes</h2>
        <div className="x:text-muted-foreground">Coming soon</div>
      </section>
    </div>
  );
}
