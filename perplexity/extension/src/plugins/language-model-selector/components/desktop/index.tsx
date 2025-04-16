import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SelectContent } from "@/components/ui/select";
import {
  deepResearchLanguageModels,
  fastLanguageModels,
  reasoningLanguageModels,
} from "@/plugins/_core/misc/remote-language-models.loader";
import AutoModeOption from "@/plugins/language-model-selector/components/AutoModeOption";
import LanguageModelGroup from "@/plugins/language-model-selector/components/desktop/LanguageModelGroup";
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
        "x:flex x:max-h-[calc(var(--available-height))] x:items-start x:justify-between x:gap-2 x:overflow-y-auto x:p-2",
      )}
    >
      <div>
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
            />
            <LanguageModelGroup
              title="Research"
              models={deepResearchLanguageModels}
              tooltipPlacement="right"
            />
          </div>
        </div>
        <div className="x:mx-auto x:my-2 x:h-px x:w-full x:bg-border/50" />
        <AutoModeOption />
      </div>
    </Comp>
  );
}
