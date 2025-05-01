import { lazily } from "react-lazily";
import type { RouteObject } from "react-router-dom";
import { redirect } from "react-router-dom";

import Page from "@/entrypoints/options-page/components/Page";
import { getLocalThemesService } from "@/plugins/_core/custom-theme/indexed-db";
import { BUILTIN_THEME_REGISTRY } from "@/plugins/_core/custom-theme/themes/theme-registry";

const { CreateThemePage } = lazily(
  () =>
    import(
      "@/entrypoints/options-page/dashboard/pages/themes/pages/create-theme/CreateThemePage"
    ),
);

const { EditThemePage } = lazily(
  () =>
    import(
      "@/entrypoints/options-page/dashboard/pages/themes/pages/edit-theme/EditThemePage"
    ),
);

const { ThemesListing } = lazily(
  () =>
    import(
      "@/entrypoints/options-page/dashboard/pages/themes/pages/ThemesListing"
    ),
);

export const ThemesPageRoutes: RouteObject[] = [
  {
    path: "new",
    element: <Page title="Create Custom Theme" page={CreateThemePage} />,
  },
  {
    path: ":themeId",
    children: [
      {
        index: true,
        loader: () => redirect("/themes"),
      },
      {
        path: "edit",
        id: "editTheme",
        loader: async ({ params }) => {
          const { themeId } = params;

          if (!themeId) return redirect("/themes");

          const builtInTheme = BUILTIN_THEME_REGISTRY.find(
            (theme) => theme.id === themeId,
          );

          if (builtInTheme) return builtInTheme;

          const localTheme = await getLocalThemesService().get(themeId);

          if (!localTheme) return redirect("/themes");

          return localTheme;
        },
        element: <Page title="Edit Custom Theme" page={EditThemePage} />,
      },
    ],
  },
  {
    index: true,
    element: <Page title="Custom Themes" page={ThemesListing} />,
  },
];
