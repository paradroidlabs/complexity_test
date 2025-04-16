import { useMutation } from "@tanstack/react-query";
import type { DeepRequired } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { toast } from "@/components/ui/use-toast";
import type { ThemeFormValues } from "@/data/dashboard/themes/theme-form.types";
import { useBaseThemeForm } from "@/entrypoints/options-page/dashboard/pages/themes/hooks/useBaseThemeForm";
import { getLocalThemesService } from "@/services/indexed-db/themes";

const initialValues: DeepRequired<ThemeFormValues> = {
  title: "Untitled Theme",
  fonts: { ui: "", mono: "" },
  accentColor: "",
  enhanceThreadTypography: false,
  customCss: "",
};

export function useThemeForm() {
  const { form, generateThemeData } = useBaseThemeForm(initialValues);

  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["customTheme", "create"],
    mutationFn: async (data: ThemeFormValues) => {
      const themeData = await generateThemeData(data);
      const savedThemeId = await getLocalThemesService().add({
        id: `${Date.now()}-${data.title.toLowerCase().replace(/ /g, "-")}`,
        author: "local",
        config: data,
        ...themeData,
      });
      return savedThemeId;
    },
    onSuccess: () => {
      navigate("..");
      toast({
        title: "✅ Theme created",
        description: "Your theme has been saved successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "❌ Failed to create theme",
        description: error.message,
      });
    },
  });

  const onSubmit = form.handleSubmit((data) => mutateAsync(data));

  return {
    form,
    isPending,
    onSubmit,
  };
}
