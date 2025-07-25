import type { Theme } from "@/data/dashboard/themes/theme.types";
import {
  generateAccentColorOverrides,
  generatePalette,
} from "@/entrypoints/options-page/dashboard/pages/themes/index.public";

export function legacyThemeMigration(theme: Theme) {
  if (theme.config == null) return;

  console.log("Migrating theme", theme.id);

  if (theme.config.accentColorSelection == null) {
    theme.config.accentColorSelection = "default";
  }

  if (
    theme.config.accentColor?.length != null &&
    theme.config.accentColor.length > 0
  ) {
    theme.config.accentColorSelection = "custom";

    const palette = generatePalette(theme.config.accentColor);

    theme.displayBannerColors = [palette.light.super200, palette.dark.super200];
    theme.css = generateAccentColorOverrides({
      light: {
        super100: palette.light.super100,
        super200: palette.light.super200,
      },
      dark: {
        super100: palette.dark.super100,
        super200: palette.dark.super200,
      },
    });
  }
}
