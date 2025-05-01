import { zodResolver } from "@hookform/resolvers/zod";
import type { DeepRequired } from "react-hook-form";
import { useForm } from "react-hook-form";

import {
  generateDarkModeColorOverrides,
  generatePalette,
  generateUiFontsOverrides,
} from "@/entrypoints/options-page/dashboard/pages/themes/pages/utils";
import {
  ThemeFormSchema,
  type ThemeFormValues,
} from "@/plugins/_core/custom-theme/theme-form.types";
import type { Theme } from "@/plugins/_core/custom-theme/themes/theme-registry.types";

type ThemeDataResult = Pick<Theme, "css" | "title">;

export function useBaseThemeForm(defaultValues: DeepRequired<ThemeFormValues>) {
  const form = useForm({
    resolver: zodResolver(ThemeFormSchema),
    mode: "onChange",
    defaultValues,
  });

  const generateThemeData = async (
    data: ThemeFormValues,
  ): Promise<ThemeDataResult> => {
    let css = "";

    if (data.accentColor) {
      css += generateDarkModeColorOverrides(generatePalette(data.accentColor));
    }
    if (data.fonts.ui || data.fonts.mono || data.enhanceThreadTypography) {
      css += generateUiFontsOverrides({
        uiFont: data.fonts.ui ?? defaultValues.fonts.ui,
        monoFont: data.fonts.mono ?? defaultValues.fonts.mono,
      });
    }

    if (data.enhanceThreadTypography) {
      css += (
        await import(
          "@/plugins/_core/custom-theme/themes/css-files/complexity/base.css?inline"
        )
      ).default;
    }

    css += data.customCss;

    if (
      !data.accentColor &&
      !data.fonts.ui &&
      !data.fonts.mono &&
      !data.customCss
    ) {
      throw new Error("Please add at least one customization");
    }

    return { css, title: data.title };
  };

  return {
    form,
    generateThemeData,
  };
}
