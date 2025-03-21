import { useHotkeys } from "react-hotkeys-hook";

import {
  deepResearchLanguageModels,
  fastLanguageModels,
  reasoningLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";
import {
  isDeepResearchLanguageModelCode,
  isFastLanguageModelCode,
  isReasoningLanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { getPlatform } from "@/hooks/usePlatformDetection";
import { sharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import { PplxCookieSearchModelsSchema } from "@/plugins/_core/ui-groups/query-box/types";
import { getCookie, jsonUtils, keysToString } from "@/utils/utils";

export default function useBindBetterLanguageModelSelectorHotKeys() {
  const { isMobile } = useIsMobileStore();

  useHotkeys(
    keysToString([getPlatform() === "mac" ? Key.Meta : Key.Control, "."]),
    (e) => {
      e.stopImmediatePropagation();

      const currentState = getCurrentState();
      const nextState = getNextState(currentState);

      const { data: searchModels } = PplxCookieSearchModelsSchema.safeParse(
        jsonUtils.safeParse(getCookie("pplx.search-models-raw") ?? ""),
      );

      switch (nextState) {
        case "deepResearch":
          sharedQueryBoxStore
            .getState()
            .setSelectedLanguageModel(
              searchModels?.deepResearch != null &&
                isDeepResearchLanguageModelCode(searchModels.deepResearch)
                ? searchModels.deepResearch
                : deepResearchLanguageModels[0]!.code,
            );
          break;
        case "reasoning":
          sharedQueryBoxStore
            .getState()
            .setSelectedLanguageModel(
              searchModels?.reasoning != null &&
                isReasoningLanguageModelCode(searchModels.reasoning)
                ? searchModels.reasoning
                : reasoningLanguageModels[0]!.code,
            );
          break;
        case "pro":
          sharedQueryBoxStore
            .getState()
            .setSelectedLanguageModel(
              searchModels?.pro != null &&
                isFastLanguageModelCode(searchModels.pro) &&
                searchModels.pro !== "turbo"
                ? searchModels.pro
                : fastLanguageModels[0]!.code,
            );
          break;
        case "auto":
          sharedQueryBoxStore.getState().setSelectedLanguageModel("turbo");
          break;
      }
    },
    {
      enabled: !isMobile,
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );
}

const states = ["auto", "pro", "reasoning", "deepResearch"] as const;
type LanguageModelState = (typeof states)[number];

function getCurrentState(): LanguageModelState {
  const selectedLanguageModel =
    sharedQueryBoxStore.getState().selectedLanguageModel;
  const isProSearchEnabled = sharedQueryBoxStore.getState().isProSearchEnabled;

  if (isDeepResearchLanguageModelCode(selectedLanguageModel))
    return "deepResearch";
  if (isReasoningLanguageModelCode(selectedLanguageModel)) return "reasoning";
  if (!isProSearchEnabled && selectedLanguageModel === "turbo") return "auto";
  return "pro";
}

function getNextState(currentState: LanguageModelState): LanguageModelState {
  const currentIndex = states.indexOf(currentState);
  const nextIndex = (currentIndex + 1) % states.length;
  return states[nextIndex]!;
}
