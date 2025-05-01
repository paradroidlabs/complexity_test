import type { IconType } from "react-icons";

import type { ColorScheme } from "@/plugins/_core/global-stores/color-scheme-store";
import type { SearchFilter } from "@/plugins/command-menu/public/items";
import type { whereAmI } from "@/utils/utils";

export type BaseItem = {
  icon: IconType;
  label: string;
  keywords: string[];
  shortcut?: string[];
};

export type ZenModeItem = BaseItem & {
  type: "enable" | "disable";
  action: () => void;
};

export type SearchItem = BaseItem & {
  code: SearchFilter;
};

export type NavigationItem = BaseItem & {
  path?: string;
  external?: boolean;
  whereAmI: ReturnType<typeof whereAmI>;
};

export type ColorSchemeItem = BaseItem & {
  scheme: ColorScheme;
};
