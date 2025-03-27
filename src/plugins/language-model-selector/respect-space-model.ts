import { isLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/spa-router/listeners";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { Space } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";
import { parseUrl, whereAmI } from "@/utils/utils";

csLoaderRegistry.register({
  id: "plugin:queryBox:languageModelSelector:respectSpaceModel",
  dependencies: [
    "cache:pluginsStates",
    "cache:extensionLocalStorage",
    "plugin:queryBox:initSharedStore",
  ],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates["queryBox:languageModelSelector"] ||
      !settings.plugins["queryBox:languageModelSelector"]
        .respectDefaultSpaceModel
    )
      return;

    handler(window.location.href);

    spaRouteChangeCompleteSubscribe((url) => {
      handler(url);
    });
  },
});

async function handler(url: string) {
  const location = whereAmI(url);

  if (location !== "collection") return;

  const spaceSlug = parseUrl(url).pathname.split("/").pop();

  if (spaceSlug == null) return;

  const spacesData =
    queryClient.getQueryData<Space[]>(pplxApiQueries.spaces.queryKey) ??
    (await queryClient.fetchQuery(pplxApiQueries.spaces));

  if (spacesData == null) return;

  const space = spacesData.find(
    (space) => space.slug === spaceSlug || space.uuid === spaceSlug,
  );

  if (
    space == null ||
    space.model_selection == null ||
    !isLanguageModelCode(space.model_selection)
  )
    return;

  sharedQueryBoxStore
    .getState()
    .setSelectedLanguageModel(space.model_selection);
}
