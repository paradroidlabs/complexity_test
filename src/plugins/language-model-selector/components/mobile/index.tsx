import { DialogProps } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  deepResearchLanguageModels,
  fastLanguageModels,
  reasoningLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";
import AutoModeOption from "@/plugins/language-model-selector/components/AutoModeOption";
import LanguageModelGroup from "@/plugins/language-model-selector/components/mobile/LanguageModelGroup";
import ProSearchSwitch from "@/plugins/language-model-selector/components/mobile/ProSearchSwitch";

export default function MobileContent({ ...props }: DialogProps) {
  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent
        side="bottom"
        closeButton={false}
        className="x:flex x:flex-col x:gap-2"
      >
        <ProSearchSwitch />
        <div className="x:mx-auto x:my-2 x:min-h-px x:w-full x:bg-border/50" />
        <AutoModeOption />
        <div className="x:mx-auto x:my-2 x:min-h-px x:w-full x:bg-border/50" />
        <LanguageModelGroup
          title="Reasoning"
          models={reasoningLanguageModels}
        />
        <LanguageModelGroup title="Standard" models={fastLanguageModels} />
        <LanguageModelGroup
          title="Deep Research"
          models={deepResearchLanguageModels}
        />
      </SheetContent>
    </Sheet>
  );
}
