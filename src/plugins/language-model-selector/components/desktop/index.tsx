import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { SelectContent } from "@/components/ui/select";
import FastLanguageModels from "@/plugins/language-model-selector/components/desktop/FastLanguageModels";
import ProSearchSwitch from "@/plugins/language-model-selector/components/desktop/ProSearchSwitch";
import ReasoningLanguageModels from "@/plugins/language-model-selector/components/desktop/ReasoningLanguageModels";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";

export default function DesktopContent() {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { hotkeyRef, component } = context;

  const Comp = component === "dropdown" ? DropdownMenuContent : SelectContent;

  return (
    <Comp
      className={cn(
        PPLX_SCROLLBAR_CLASSES,
        "x-flex x-max-h-[45vh] x-items-start x-justify-between x-gap-2 x-overflow-y-auto x-p-2",
      )}
    >
      <div ref={hotkeyRef}>
        <ProSearchSwitch />
        <div className="x-mx-auto x-my-2 x-h-px x-w-full x-bg-border/50" />
        <div className="x-flex x-items-start x-justify-between x-gap-2">
          <FastLanguageModels />
          <ReasoningLanguageModels />
        </div>
      </div>
    </Comp>
  );
}
