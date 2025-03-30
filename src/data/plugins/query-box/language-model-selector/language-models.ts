import { APP_CONFIG } from "@/app.config";
import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { cplxApiQueries } from "@/services/cplx-api/query-keys";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { errorWrapper } from "@/utils/error-wrapper";
import { queryClient } from "@/utils/ts-query-client";

export const localLanguageModels = [
  {
    label: "Claude 3.7 Sonnet",
    shortLabel: "Sonnet",
    code: "claude2",
    provider: "Anthropic",
    limitKey: "gpt4_limit",
    type: "fast",
    hideFromList: false,
  },
  {
    label: "Claude 3.7 Sonnet",
    shortLabel: "Sonnet Thinking",
    code: "claude37sonnetthinking",
    provider: "Anthropic",
    limitKey: "pro_reasoning_limit",
    type: "reasoning",
    hideFromList: false,
  },
  {
    label: "GPT-4.5",
    shortLabel: "GPT-4.5",
    code: "gpt45",
    provider: "OpenAI",
    limitKey: "gpt45_limit",
    type: "fast",
    hideFromList: false,
  },
  {
    label: "O3 Mini",
    shortLabel: "O3 Mini",
    code: "o3mini",
    provider: "OpenAI",
    limitKey: "o1_limit",
    type: "reasoning",
    hideFromList: false,
  },
  {
    label: "DeepSeek R1 (1776)",
    shortLabel: "R1",
    code: "r1",
    provider: "DeepSeek",
    limitKey: "pro_reasoning_limit",
    type: "reasoning",
    hideFromList: false,
  },
  {
    label: "GPT-4o",
    shortLabel: "GPT-4o",
    code: "gpt4o",
    provider: "OpenAI",
    limitKey: "gpt4_limit",
    type: "fast",
    hideFromList: false,
  },
  {
    label: "Gemini 2.0 Flash",
    shortLabel: "Gemini Flash",
    code: "gemini2flash",
    provider: "Google",
    limitKey: "gpt4_limit",
    type: "fast",
    hideFromList: false,
  },
  {
    label: "Grok-2",
    shortLabel: "Grok-2",
    code: "grok",
    provider: "xAI",
    limitKey: "gpt4_limit",
    type: "fast",
    hideFromList: false,
  },
  {
    label: "Deep Research",
    shortLabel: "Deep Research",
    code: "pplx_alpha",
    provider: "PerplexityDeepResearch",
    limitKey: "pro_reasoning_limit",
    type: "deepResearch",
    hideFromList: false,
  },
  {
    label: "Deep Research (High)",
    shortLabel: "Deep Research (High)",
    code: "pplx_beta",
    provider: "PerplexityDeepResearch",
    limitKey: "pro_reasoning_limit",
    type: "deepResearch",
    hideFromList: true,
  },
  {
    label: "Sonar",
    shortLabel: "Sonar",
    code: "experimental",
    provider: "Perplexity",
    limitKey: "gpt4_limit",
    type: "fast",
    hideFromList: false,
  },
  {
    label: "Auto",
    shortLabel: "Auto",
    code: "pplx_pro",
    provider: "Perplexity",
    type: "auto",
    hideFromList: true,
  },
  {
    label: "Auto (Free)",
    shortLabel: "Auto (Free)",
    code: "turbo",
    provider: "Perplexity",
    type: "auto",
    hideFromList: true,
  },
] as const;

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

csLoaderRegistry.register({
  id: "cache:languageModels",
  dependencies: ["cache:pluginsStates"],
  loader: async () => {
    if (APP_CONFIG.IS_DEV) return;

    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();

    if (!pluginsEnableStates["queryBox:languageModelSelector"])
      return undefined;

    const [data, error] = await errorWrapper(() =>
      queryClient.fetchQuery({
        ...cplxApiQueries.remoteLanguageModels,
        // gcTime: Infinity,
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
