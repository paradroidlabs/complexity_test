import { APP_CONFIG } from "@/app.config";
import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { localLanguageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import type { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { errorWrapper } from "@/utils/error-wrapper";
import { queryClient } from "@/utils/ts-query-client";

export let languageModels: LanguageModel[] = [...localLanguageModels];

export let fastLanguageModels: LanguageModel[] = [
  ...languageModels.filter(
    (model) => !model.hideFromList && model.type === "fast",
  ),
];

export let reasoningLanguageModels: LanguageModel[] = [
  ...languageModels.filter(
    (model) => !model.hideFromList && model.type === "reasoning",
  ),
];

export let deepResearchLanguageModels: LanguageModel[] = [
  ...languageModels.filter(
    (model) => !model.hideFromList && model.type === "deepResearch",
  ),
];

export let autoLanguageModels: LanguageModel[] = [
  ...languageModels.filter(
    (model) => !model.hideFromList && model.type === "auto",
  ),
];

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:languageModels": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "cache:languageModels",
    dependencies: ["cache:pluginsStates"],
    loader: async ({ "cache:pluginsStates": pluginsStates }) => {
      if (APP_CONFIG.IS_DEV) return;

      if (!pluginsStates["queryBox:languageModelSelector"]) return undefined;

      const [data, error] = await errorWrapper(() =>
        queryClient.fetchQuery({
          ...cplxApiQueries.remoteLanguageModels,
          gcTime: Infinity,
        }),
      )();

      if (!error && data) {
        languageModels = data;
        fastLanguageModels = languageModels.filter(
          (model) => model.type === "fast",
        );
        reasoningLanguageModels = languageModels.filter(
          (model) => model.type === "reasoning",
        );
        deepResearchLanguageModels = languageModels.filter(
          (model) => model.type === "deepResearch",
        );
        autoLanguageModels = languageModels.filter(
          (model) => model.type === "auto",
        );
      }
    },
  });
}
