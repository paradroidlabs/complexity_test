import { LuChevronLeft } from "react-icons/lu";
import { Link, useLoaderData } from "react-router-dom";

import { ThemeForm } from "@/entrypoints/options-page/dashboard/pages/themes/components/ThemeForm";
import { DeleteButton } from "@/entrypoints/options-page/dashboard/pages/themes/pages/edit-theme/components/DeleteButton";
import { useThemeForm } from "@/entrypoints/options-page/dashboard/pages/themes/pages/edit-theme/hooks/useThemeForm";
import type { Theme } from "@/plugins/_core/custom-theme/themes/theme-registry.types";

export function EditThemePage() {
  const theme = useLoaderData() as Theme;
  const { form, isPending, onSubmit, deleteTheme, isDeleting } =
    useThemeForm(theme);

  return (
    <div className="x:max-w-3xl x:space-y-6">
      <Link
        to="/themes"
        className="x:mb-4 x:flex x:items-center x:gap-2 x:text-muted-foreground x:transition x:hover:text-foreground"
      >
        <LuChevronLeft />
        Back to themes
      </Link>
      <div>
        <h1 className="x:mb-2 x:text-2xl x:font-bold">Editing Theme</h1>
      </div>
      <ThemeForm
        form={form}
        isPending={isPending}
        submitText="Save Changes"
        footer={<DeleteButton isDeleting={isDeleting} onDelete={deleteTheme} />}
        onSubmit={onSubmit}
      />
    </div>
  );
}
