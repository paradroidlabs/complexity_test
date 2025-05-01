import { getLocalThemesService } from "@/plugins/_core/custom-theme/indexed-db";
import { BUILTIN_THEME_REGISTRY } from "@/plugins/_core/custom-theme/themes/theme-registry";
import type { Theme } from "@/plugins/_core/custom-theme/themes/theme-registry.types";

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
