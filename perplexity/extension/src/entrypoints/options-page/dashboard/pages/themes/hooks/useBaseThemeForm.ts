import { zodResolver } from "@hookform/resolvers/zod";
import type { DeepRequired } from "react-hook-form";
import { useForm } from "react-hook-form";

import {
  cometColors,
  cplxColors,
} from "@/data/dashboard/themes/built-in-colors";
import {
  ThemeFormSchema,
  type ThemeFormValues,
} from "@/data/dashboard/themes/theme.types";
import type { Theme } from "@/data/dashboard/themes/theme.types";
import {
  generateAccentColorOverrides,
  generatePalette,
  generateUiFontsOverrides,
} from "@/entrypoints/options-page/dashboard/pages/themes/pages/utils";
import { useEvent } from "@/hooks/useEvent";

type ThemeDataResult = Pick<Theme, "css" | "title" | "displayBannerColors">;
type ColorPaletteForAccent = Parameters<typeof generateAccentColorOverrides>[0];

export function useBaseThemeForm(defaultValues: DeepRequired<ThemeFormValues>) {
  const form = useForm({
    resolver: zodResolver(ThemeFormSchema),
    mode: "onChange",
    defaultValues,
  });

  const generateThemeData = useEvent(
    async (data: ThemeFormValues): Promise<ThemeDataResult> => {
      const cssParts: string[] = [];
      let displayBannerColors: string[] = [];

      let accentPalette: ColorPaletteForAccent | undefined;

      if (data.accentColorSelection === "custom" && data.accentColor) {
        accentPalette = generatePalette(data.accentColor);
      } else if (data.accentColorSelection === "built-in") {
        const color = [...cplxColors, ...cometColors].find(
          (c) => c.value === data.builtInAccentColor,
        );

        invariant(color, "Invalid built-in color");
        accentPalette = color.color;
      }

      if (accentPalette) {
        cssParts.push(generateAccentColorOverrides(accentPalette));
        displayBannerColors = [
          accentPalette.light.super200,
          accentPalette.dark.super200,
        ];
      }

      const fontUiData = {
        uiFont: data.fonts.ui ?? defaultValues.fonts.ui,
        monoFont: data.fonts.mono ?? defaultValues.fonts.mono,
      };

      if (
        fontUiData.uiFont ||
        fontUiData.monoFont ||
        data.enhanceThreadTypography
      ) {
        cssParts.push(generateUiFontsOverrides(fontUiData));
      }

      if (data.enhanceThreadTypography) {
        cssParts.push(
          (
            await import(
              "@/data/dashboard/themes/assets/vibrant-base.css?inline"
            )
          ).default,
        );
      }

      if (data.customCss) {
        cssParts.push(data.customCss);
      }

      return {
        css: cssParts.join("\n"),
        title: data.title,
        displayBannerColors,
      };
    },
  );

  return {
    form,
    generateThemeData,
  };
}
