import { useMutation } from "@tanstack/react-query";
import type { DeepRequired } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { toast } from "@/components/ui/use-toast";
import type { ThemeFormValues } from "@/data/dashboard/themes/theme-form.types";
import type { Theme } from "@/data/plugins/themes/theme-registry.types";
import { useBaseThemeForm } from "@/entrypoints/options-page/dashboard/pages/themes/hooks/useBaseThemeForm";
import { getLocalThemesService } from "@/services/indexed-db/themes";

export function useThemeForm(theme: Theme) {
  const initialValues: DeepRequired<ThemeFormValues> = {
    title: theme.title,
    fonts: {
      ui: theme.config?.fonts?.ui ?? "",
      mono: theme.config?.fonts?.mono ?? "",
    },
    accentColor: theme.config?.accentColor ?? "",
    enhanceThreadTypography: theme.config?.enhanceThreadTypography ?? false,
    customCss: theme.config?.customCss ?? "",
  };

  const navigate = useNavigate();

  const { form, generateThemeData } = useBaseThemeForm(initialValues);

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["customTheme", "edit", theme.id],
    mutationFn: async (data: ThemeFormValues) => {
      const themeData = await generateThemeData(data);
      await getLocalThemesService().update({
        ...theme,
        ...themeData,
        config: data,
      });
      return theme;
    },
    onSuccess: (_, variables) => {
      form.reset({
        ...initialValues,
        ...variables,
      });
      toast({
        title: "✅ Theme saved",
        description: "Your theme has been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed to save theme",
        description: error.message,
      });
    },
  });

  const { mutateAsync: deleteTheme, isPending: isDeleting } = useMutation({
    mutationKey: ["customTheme", "delete", theme.id],
    mutationFn: async () => {
      await getLocalThemesService().delete(theme.id);
    },
    onSuccess: () => {
      navigate("..");
      toast({
        title: "✅ Theme deleted",
        description: "Your theme has been deleted successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed to delete theme",
        description: error.message,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => mutateAsync(data));

  return {
    form,
    isPending,
    onSubmit,
    deleteTheme,
    isDeleting,
  };
}
