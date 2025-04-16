import { BUILTIN_THEME_REGISTRY } from "@/data/plugins/themes/theme-registry";
import type { Theme } from "@/data/plugins/themes/theme-registry.types";
import { getLocalThemesService } from "@/services/indexed-db/themes";

export async function getThemeCss(themeId: Theme["id"]) {
  return getBuiltInThemeCss(themeId) || (await getLocalThemeCss(themeId)) || "";
}

export function getBuiltInThemeCss(themeId: Theme["id"]) {
  return (
    BUILTIN_THEME_REGISTRY.find((theme) => theme.id === themeId)?.css ?? ""
  );
}

export async function getLocalThemeCss(themeId: Theme["id"]) {
  return (await getLocalThemesService().get(themeId))?.css ?? "";
}
