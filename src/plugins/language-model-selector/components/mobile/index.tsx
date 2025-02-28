import { DialogProps } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import FastLanguageModels from "@/plugins/language-model-selector/components/mobile/FastLanguageModels";
import ProSearchSwitch from "@/plugins/language-model-selector/components/mobile/ProSearchSwitch";
import ReasoningLanguageModels from "@/plugins/language-model-selector/components/mobile/ReasoningLanguageModels";

export default function MobileContent({
  setHighlightedItem,
  ...props
}: DialogProps & { setHighlightedItem: (item: string) => void }) {
  return (
    <Sheet lazyMount unmountOnExit {...props}>
      <SheetContent
        side="bottom"
        closeButton={false}
        className="x-flex x-flex-col x-gap-2"
      >
        <ProSearchSwitch setHighlightedItem={setHighlightedItem} />
        <div className="x-mx-auto x-my-2 x-min-h-px x-w-full x-bg-border/50" />
        <ReasoningLanguageModels />
        <FastLanguageModels />
      </SheetContent>
    </Sheet>
  );
}
