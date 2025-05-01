import { Trans } from "react-i18next";

import {
  CommandEmpty,
  CommandGroup,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { InlineCode } from "@/components/ui/typography";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import ColorSchemeItem from "@/plugins/command-menu/components/ColorSchemeItem";
import NavigationItem from "@/plugins/command-menu/components/NavigationItem";
import SearchItem from "@/plugins/command-menu/components/SearchItem";
import SpaceSearchItems from "@/plugins/command-menu/components/space-search-items/SpaceSearchItems";
import SpaceThreadsSearchItems from "@/plugins/command-menu/components/space-search-items/SpaceThreadsSearchItems";
import ThreadSearchItems from "@/plugins/command-menu/components/thread-search-items/ThreadSearchItems";
import ZenModeItem from "@/plugins/command-menu/components/ZenModeItem";
import {
  ZENMODE_ITEMS,
  COLOR_SCHEME_ITEMS,
  NAVIGATION_ITEMS,
  SEARCH_ITEMS,
} from "@/plugins/command-menu/public/items";
import { useCommandMenuStore } from "@/plugins/command-menu/public/store";

const FilteredContent = memo(function FilteredContent() {
  return (
    <CsUiPluginsGuard
      requiresLoggedIn
      fallback={<CommandEmpty>Please sign in</CommandEmpty>}
    >
      <ThreadSearchItems />
      <SpaceSearchItems />
      <SpaceThreadsSearchItems />
    </CsUiPluginsGuard>
  );
});

const DefaultContent = memo(function DefaultContent({
  searchValue,
}: {
  searchValue: string;
}) {
  return (
    <>
      <CommandEmpty>
        <Trans
          i18nKey="plugin-command-menu:commandMenu.noResults"
          components={{
            emphasis: <InlineCode />,
          }}
          values={{
            code: searchValue,
          }}
        />
      </CommandEmpty>
      <CommandGroup
        heading={t("plugin-command-menu:commandMenu.groups.search")}
      >
        {SEARCH_ITEMS.map((item, idx) => (
          <SearchItem key={idx} {...item} />
        ))}
      </CommandGroup>

      <CommandSeparator />

      <CommandGroup
        heading={t("plugin-command-menu:commandMenu.groups.quickNavigations")}
      >
        {NAVIGATION_ITEMS.map((item, idx) => (
          <NavigationItem key={idx} {...item} />
        ))}
      </CommandGroup>

      <CommandSeparator />

      <CsUiPluginsGuard dependentPluginIds={["zenMode"]}>
        <CommandGroup
          heading={t("plugin-command-menu:commandMenu.groups.zenMode")}
        >
          {ZENMODE_ITEMS.map((item, idx) => (
            <ZenModeItem key={idx} {...item} />
          ))}
        </CommandGroup>
      </CsUiPluginsGuard>

      <CommandSeparator />

      <CommandGroup
        heading={t("plugin-command-menu:commandMenu.groups.colorScheme")}
      >
        {COLOR_SCHEME_ITEMS.map((item, idx) => (
          <ColorSchemeItem key={idx} {...item} />
        ))}
      </CommandGroup>
    </>
  );
});

export const CommandContent = memo(function CommandContent() {
  const { filter, searchValue } = useCommandMenuStore((state) => ({
    filter: state.filter,
    searchValue: state.searchValue,
  }));

  return (
    <CommandList>
      {filter ? (
        <FilteredContent />
      ) : (
        <DefaultContent searchValue={searchValue} />
      )}
    </CommandList>
  );
});
