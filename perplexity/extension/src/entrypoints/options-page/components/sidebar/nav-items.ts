import { BiExtension } from "react-icons/bi";
import { LuFileText, LuPalette, LuSettings } from "react-icons/lu";

export type NavItem = {
  icon?: React.ElementType;
  label: string;
  path: string;
  children?: NavItem[];
  expanded?: boolean;
};

export const defaultNavItems: NavItem[] = [
  {
    icon: BiExtension,
    label: "Plugins",
    path: "/plugins",
  },
  {
    icon: LuPalette,
    label: "Themes",
    path: "/themes",
  },
  {
    icon: LuFileText,
    label: "Release Notes",
    path: "/release-notes",
  },
  {
    icon: LuSettings,
    label: "Settings",
    path: "/settings",
  },
];
