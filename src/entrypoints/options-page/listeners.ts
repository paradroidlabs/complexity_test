import { APP_CONFIG } from "@/app.config";
import { fetchExtensionLocalStorageData } from "@/services/extension-local-storage";
import { ExtensionPermissionsService } from "@/services/extension-permissions";
import { getPplxThemePreloaderService } from "@/services/pplx-theme-preloader";
import { getThemeCss } from "@/utils/pplx-theme-loader-utils";
import { queryClient } from "@/utils/ts-query-client";

export function setupOptionPageListeners() {
  ExtensionPermissionsService.setupReactiveListeners();

  const theme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  $("html").attr("data-color-scheme", theme);

  updateChosenThemeOptimistically();

  if (APP_CONFIG.BROWSER === "chrome") {
    queryClient.getMutationCache().subscribe(async ({ mutation, type }) => {
      const mutationKey = mutation?.options.mutationKey;

      if (!mutationKey) return;

      const isThemeMutation =
        mutationKey[0] === "customTheme" &&
        mutation.state.status === "success" &&
        type === "updated";

      const isExtensionLocalStorageMutation =
        mutationKey[0] === "updateExtensionLocalStorage" &&
        mutation.state.status === "success" &&
        type === "updated";

      if (isThemeMutation || isExtensionLocalStorageMutation) {
        updateChosenThemeOptimistically();
      }
    });
  }
}

async function updateChosenThemeOptimistically() {
  const chosenThemeId = (await fetchExtensionLocalStorageData()).theme;

  getPplxThemePreloaderService().updateThemeConfig({
    chosenThemeId,
    css: await getThemeCss(chosenThemeId),
  });
}
