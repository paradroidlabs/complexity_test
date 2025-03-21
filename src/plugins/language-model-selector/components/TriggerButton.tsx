import { type ComponentType, type SVGProps } from "react";
import { FaShuffle } from "react-icons/fa6";
import { LuCpu } from "react-icons/lu";

import FaAtom from "@/components/icons/FaAtom";
import FaLightBulbOn from "@/components/icons/FaLightBulbOn";
import ProSearchIcon from "@/components/icons/ProSearchIcon";
import Tooltip from "@/components/Tooltip";
import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import {
  isDeepResearchLanguageModelCode,
  isReasoningLanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";

export default function BetterLanguageModelSelectorTriggerButton() {
  const { isMobile } = useIsMobileStore();

  const isProSearchEnabled = useSharedQueryBoxStore(
    (state) => state.isProSearchEnabled,
  );
  const selectedLanguageModel = useSharedQueryBoxStore(
    (state) => state.selectedLanguageModel,
  );

  const isReasoningModel = useMemo(
    () => isReasoningLanguageModelCode(selectedLanguageModel),
    [selectedLanguageModel],
  );

  const modelInfo = useMemo(
    () => languageModels.find((m) => m.code === selectedLanguageModel),
    [selectedLanguageModel],
  );

  const label = useMemo(() => {
    const fragments = [];
    if (
      isProSearchEnabled &&
      !isReasoningModel &&
      !isDeepResearchLanguageModelCode(selectedLanguageModel) &&
      selectedLanguageModel !== "turbo" &&
      !isMobile
    )
      fragments.push("Pro");
    if (
      !isDeepResearchLanguageModelCode(selectedLanguageModel) &&
      isReasoningModel &&
      !isMobile
    )
      fragments.push("Reasoning");
    fragments.push(
      modelInfo?.shortLabel !== "Auto"
        ? modelInfo?.shortLabel
        : t("plugin-model-selectors:languageModelSelector:autoMode.title"),
    );
    return fragments.join(" · ");
  }, [
    isProSearchEnabled,
    isReasoningModel,
    isMobile,
    selectedLanguageModel,
    modelInfo?.shortLabel,
  ]);

  const Icon = useMemo(() => {
    if (isDeepResearchLanguageModelCode(selectedLanguageModel)) return FaAtom;
    if (selectedLanguageModel === "turbo") return FaShuffle;

    return isReasoningModel
      ? FaLightBulbOn
      : isProSearchEnabled
        ? ProSearchIcon
        : ((modelInfo?.provider != null
            ? (languageModelProviderIcons?.[modelInfo.provider] ?? LuCpu)
            : LuCpu) as ComponentType<SVGProps<SVGSVGElement>>);
  }, [
    selectedLanguageModel,
    isReasoningModel,
    isProSearchEnabled,
    modelInfo?.provider,
  ]);

  return (
    <Tooltip
      content={t("plugin-model-selectors:languageModelSelector.tooltip")}
    >
      <div
        className={cn(
          "x:flex x:h-8 x:items-center x:justify-center x:gap-2 x:rounded-full x:border x:border-transparent x:bg-buttonBackground x:px-2.5 x:text-sm x:font-medium x:text-foreground x:transition-all x:active:scale-95",
          {
            "x:border-primary/30 x:bg-primary/10 x:text-primary":
              isProSearchEnabled && selectedLanguageModel !== "turbo",
            "x:border-border/50 x:hover:bg-primary-foreground x:hover:text-foreground":
              !isProSearchEnabled || selectedLanguageModel === "turbo",
          },
        )}
      >
        <Icon className="x:size-3.5 x:shrink-0" />
        <span className="x:truncate">{label}</span>
      </div>
    </Tooltip>
  );
}
