import { FaShuffle } from "react-icons/fa6";
import { LuCpu } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui/groups/query-box/shared-store";
import { PplxLanguageModelsService } from "@/services/cplx-api/remote-resources/pplx-language-models";
import { isDeepResearchLanguageModelCode } from "@/services/cplx-api/remote-resources/pplx-language-models/predicates";

export default function BetterLanguageModelSelectorTriggerButton() {
  const selectedLanguageModel = useSharedQueryBoxStore(
    (state) => state.selectedLanguageModel,
  );

  const isDeepResearchModel = useMemo(
    () => isDeepResearchLanguageModelCode(selectedLanguageModel),
    [selectedLanguageModel],
  );

  const modelInfo = useMemo(
    () =>
      PplxLanguageModelsService.allModels.find(
        (m) => m.code === selectedLanguageModel,
      ),
    [selectedLanguageModel],
  );

  const Icon = useMemo(() => {
    if (selectedLanguageModel === "pplx_pro") return FaShuffle;

    return modelInfo?.provider != null
      ? (PplxLanguageModelsService.icons?.[modelInfo.provider] ?? LuCpu)
      : LuCpu;
  }, [selectedLanguageModel, modelInfo?.provider]);

  return (
    <Tooltip
      content={t("plugin-model-selectors:languageModelSelector.tooltip")}
    >
      <div
        className={cn(
          "x:flex x:h-8 x:items-center x:justify-center x:gap-2 x:rounded-lg x:border x:border-border/50 x:bg-primary-foreground x:px-2.5 x:text-sm x:font-medium x:text-foreground x:transition-all x:active:scale-95",
          {
            "x:border-primary/30 x:bg-primary/10 x:text-primary":
              isDeepResearchModel,
            "x:hover:bg-primary-foreground x:hover:text-foreground":
              !isDeepResearchModel,
          },
        )}
      >
        <Icon className="x:size-4 x:shrink-0" />
        <span className="x:truncate">{modelInfo?.shortLabel}</span>
      </div>
    </Tooltip>
  );
}
