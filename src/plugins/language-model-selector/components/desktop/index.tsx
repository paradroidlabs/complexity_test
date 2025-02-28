import { SelectContent } from "@/components/ui/select";
import FastLanguageModels from "@/plugins/language-model-selector/components/desktop/FastLanguageModels";
import ProSearchSwitch from "@/plugins/language-model-selector/components/desktop/ProSearchSwitch";
import ReasoningLanguageModels from "@/plugins/language-model-selector/components/desktop/ReasoningLanguageModels";

export default function DesktopContent({
  setHighlightedItem,
}: {
  setHighlightedItem: (item: string) => void;
}) {
  return (
    <SelectContent className="custom-scrollbar x-flex x-max-h-[45vh] x-items-start x-justify-between x-gap-2 x-overflow-y-auto x-p-2">
      <div>
        <ProSearchSwitch setHighlightedItem={setHighlightedItem} />
        <div className="x-mx-auto x-my-2 x-h-px x-w-full x-bg-border/50" />
        <div className="x-flex x-items-start x-gap-2">
          <FastLanguageModels />
          <ReasoningLanguageModels />
        </div>
      </div>
    </SelectContent>
  );
}
