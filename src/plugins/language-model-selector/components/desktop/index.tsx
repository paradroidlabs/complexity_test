import { Trans } from "react-i18next";

import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SelectContent } from "@/components/ui/select";
import {
  deepResearchLanguageModels,
  fastLanguageModels,
  reasoningLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";
import AutoModeOption from "@/plugins/language-model-selector/components/AutoModeOption";
import LanguageModelGroup from "@/plugins/language-model-selector/components/desktop/LanguageModelGroup";
import ProSearchSwitch from "@/plugins/language-model-selector/components/desktop/ProSearchSwitch";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";

export default function DesktopContent() {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { component } = context;

  const Comp = component === "dropdown" ? DropdownMenuContent : SelectContent;

  return (
    <Comp
      className={cn(
        PPLX_SCROLLBAR_CLASSES,
        "x:flex x:max-h-[45vh] x:items-start x:justify-between x:gap-2 x:overflow-y-auto x:p-2",
      )}
    >
      <div>
        <ProSearchSwitch />
        <div className="x:mx-auto x:my-2 x:h-px x:w-full x:bg-border/50" />
        <div className="x:flex x:items-start x:justify-between x:gap-2">
          <LanguageModelGroup
            title="Standard"
            models={fastLanguageModels}
            tooltipPlacement="left"
          />
          <div className="x:flex x:flex-col x:gap-1">
            <LanguageModelGroup
              title="Reasoning"
              models={reasoningLanguageModels}
              tooltipPlacement="right"
              titleTooltip={
                <div className="x:max-w-[250px]">
                  <div>
                    {t(
                      "plugin-model-selectors:languageModelSelector.reasoningModels.tooltip.description",
                    )}
                  </div>
                  <Trans
                    i18nKey="plugin-model-selectors:languageModelSelector.reasoningModels.tooltip.proSearchNote"
                    components={{
                      emphasis: <span className="x:text-primary" />,
                    }}
                  />
                </div>
              }
            />
            <LanguageModelGroup
              title="Deep Research"
              models={deepResearchLanguageModels}
              tooltipPlacement="right"
              titleTooltip={
                <div className="x:max-w-[250px]">
                  <div>
                    {t(
                      "plugin-model-selectors:languageModelSelector.deepResearch.tooltip.description",
                    )}
                  </div>
                  <Trans
                    i18nKey="plugin-model-selectors:languageModelSelector.deepResearch.tooltip.proSearchNote"
                    components={{
                      emphasis: <span className="x:text-primary" />,
                    }}
                  />
                </div>
              }
            />
          </div>
        </div>
        <div className="x:mx-auto x:my-2 x:h-px x:w-full x:bg-border/50" />
        <AutoModeOption />
      </div>
    </Comp>
  );
}
