import { LuCpu } from "react-icons/lu";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { fastLanguageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";

export default function FastLanguageModels() {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { component } = context;

  const GroupComp = component === "dropdown" ? DropdownMenuGroup : SelectGroup;
  const ItemComp = component === "dropdown" ? DropdownMenuItem : SelectItem;
  const LabelComp = component === "dropdown" ? DropdownMenuLabel : SelectLabel;

  const modelsLimits = useModelLimits();

  return (
    <GroupComp className="x-m-0 x-p-0">
      <LabelComp className="x-text-base">Standard</LabelComp>
      {fastLanguageModels.map((model, index) => {
        const Icon = languageModelProviderIcons[model.provider] ?? LuCpu;

        const modelLimit = modelsLimits[model.code];
        const limit =
          modelLimit === Infinity
            ? t(
                "plugin-model-selectors:languageModelSelector.reasoningModels.usesLeft.unlimited",
              )
            : typeof modelLimit === "number"
              ? t(
                  "plugin-model-selectors:languageModelSelector.reasoningModels.usesLeft.limited",
                  { count: modelLimit },
                )
              : "";

        const tooltipContent = model.description
          ? `${limit} ${model.description}`
          : limit;

        return (
          <ItemComp
            key={model.code}
            item={model.code}
            value={model.code}
            data-column="fast"
            data-index={index}
            className="x-flex x-items-center x-justify-between x-gap-2 x-p-4 x-text-base x-text-foreground"
          >
            <div className="x-flex x-items-center x-gap-2">
              <Icon className="x-size-4" />
              <span className="x-truncate">{model.label}</span>
            </div>
            <div className="x-text-xs x-text-muted-foreground">
              {tooltipContent}
            </div>
          </ItemComp>
        );
      })}
    </GroupComp>
  );
}
