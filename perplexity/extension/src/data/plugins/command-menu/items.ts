import {
  LuComputer,
  LuGrid3X3,
  LuLayoutGrid,
  LuMoon,
  LuSettings,
  LuSun,
} from "react-icons/lu";
import { SiPerplexity } from "react-icons/si";

import PplxDiscover from "@/components/icons/PplxDiscover";
import PplxLabs from "@/components/icons/PplxLabs";
import PplxLibrary from "@/components/icons/PplxLibrary";
import PplxSpace from "@/components/icons/PplxSpace";
import PplxThread from "@/components/icons/PplxThread";
import type {
  ZenModeItem,
  ColorSchemeItem,
  NavigationItem,
  SearchItem,
} from "@/data/plugins/command-menu/types";
import { toggleZenMode } from "@/data/plugins/zen-mode/utils";

export const ZENMODE_ITEMS: ZenModeItem[] = [
  {
    type: "enable",
    label: t("plugin-command-menu:commandMenu.zenMode.enable"),
    icon: LuLayoutGrid,
    keywords: [
      t("plugin-command-menu:commandMenu.keywords.enable"),
      t("plugin-command-menu:commandMenu.keywords.zen"),
      t("plugin-command-menu:commandMenu.keywords.mode"),
    ],
    action: () => toggleZenMode(true),
  },
  {
    type: "disable",
    label: t("plugin-command-menu:commandMenu.zenMode.disable"),
    icon: LuGrid3X3,
    keywords: [
      t("plugin-command-menu:commandMenu.keywords.disable"),
      t("plugin-command-menu:commandMenu.keywords.zen"),
      t("plugin-command-menu:commandMenu.keywords.mode"),
    ],
    action: () => toggleZenMode(false),
  },
];

export type SearchFilter = "threads" | "spaces" | "spaces-threads";

export const DISABLE_LOCAL_FILTER_SEARCH_FILTERS: SearchFilter[] = ["threads"];

export const SEARCH_FILTERS: Record<
  SearchFilter,
  {
    code: SearchFilter;
    label: string;
    searchPlaceholder: string;
  }
> = {
  threads: {
    code: "threads",
    label: t("plugin-command-menu:commandMenu.filters.threads.label"),
    searchPlaceholder: t(
      "plugin-command-menu:commandMenu.filters.threads.searchPlaceholder",
    ),
  },
  spaces: {
    code: "spaces",
    label: t("plugin-command-menu:commandMenu.filters.spaces.label"),
    searchPlaceholder: t(
      "plugin-command-menu:commandMenu.filters.spaces.searchPlaceholder",
    ),
  },
  "spaces-threads": {
    code: "spaces-threads",
    label: "",
    searchPlaceholder: "",
  },
};

export const SEARCH_ITEMS: SearchItem[] = [
  {
    icon: PplxThread,
    code: SEARCH_FILTERS.threads.code,
    label: t("plugin-command-menu:commandMenu.filters.threads.label"),
    keywords: [t("plugin-command-menu:commandMenu.keywords.threads")],
  },
  {
    icon: PplxSpace,
    code: SEARCH_FILTERS.spaces.code,
    label: t("plugin-command-menu:commandMenu.filters.spaces.label"),
    keywords: [t("plugin-command-menu:commandMenu.keywords.spaces")],
  },
];

SEARCH_ITEMS.forEach((item) =>
  item.keywords.push(t("plugin-command-menu:commandMenu.keywords.search")),
);

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    icon: SiPerplexity,
    label: t("plugin-command-menu:commandMenu.navigation.home"),
    path: "/",
    keywords: [t("plugin-command-menu:commandMenu.keywords.home")],
    whereAmI: "home",
  },
  {
    icon: PplxDiscover,
    label: t("plugin-command-menu:commandMenu.navigation.discover"),
    path: "/discover",
    keywords: [t("plugin-command-menu:commandMenu.keywords.discover")],
    whereAmI: "discover",
  },
  {
    icon: PplxLibrary,
    label: t("plugin-command-menu:commandMenu.navigation.library"),
    path: "/library",
    keywords: [t("plugin-command-menu:commandMenu.keywords.library")],
    whereAmI: "library",
  },
  {
    icon: LuSettings,
    label: t("plugin-command-menu:commandMenu.navigation.userSettings"),
    path: "/settings/account",
    keywords: [
      t("plugin-command-menu:commandMenu.keywords.user"),
      t("plugin-command-menu:commandMenu.keywords.settings"),
    ],
    whereAmI: "settings",
  },
  {
    icon: PplxLabs,
    label: t("plugin-command-menu:commandMenu.navigation.labs"),
    path: "https://labs.perplexity.ai/",
    keywords: [t("plugin-command-menu:commandMenu.keywords.labs")],
    external: true,
    whereAmI: "unknown",
  },
];

NAVIGATION_ITEMS.forEach((item) =>
  item.keywords.push(t("plugin-command-menu:commandMenu.keywords.navigate")),
);

export const COLOR_SCHEME_ITEMS: ColorSchemeItem[] = [
  {
    scheme: "dark",
    icon: LuMoon,
    label: t("plugin-command-menu:commandMenu.colorSchemes.dark"),
    keywords: [
      t("plugin-command-menu:commandMenu.keywords.dark"),
      t("plugin-command-menu:commandMenu.keywords.theme"),
    ],
  },
  {
    scheme: "light",
    icon: LuSun,
    label: t("plugin-command-menu:commandMenu.colorSchemes.light"),
    keywords: [
      t("plugin-command-menu:commandMenu.keywords.light"),
      t("plugin-command-menu:commandMenu.keywords.theme"),
    ],
  },
  {
    scheme: "system",
    icon: LuComputer,
    label: t("plugin-command-menu:commandMenu.colorSchemes.system"),
    keywords: [
      t("plugin-command-menu:commandMenu.keywords.system"),
      t("plugin-command-menu:commandMenu.keywords.theme"),
    ],
  },
];

COLOR_SCHEME_ITEMS.forEach((item) => {
  item.keywords.push(
    t("plugin-command-menu:commandMenu.keywords.change"),
    t("plugin-command-menu:commandMenu.keywords.color"),
    t("plugin-command-menu:commandMenu.keywords.scheme"),
  );
});
