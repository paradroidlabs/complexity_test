import { LuCpu } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
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
      <LabelComp>Standard</LabelComp>
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
          <Tooltip
            key={model.code}
            content={
              <div className="x-max-w-48 x-text-pretty">{tooltipContent}</div>
            }
            disabled={modelsLimits[model.code] == null}
            positioning={{ placement: "left", gutter: 10 }}
          >
            <ItemComp
              key={model.code}
              item={model.code}
              value={model.code}
              data-column="fast"
              data-index={index}
              className="x-flex x-cursor-pointer x-items-center x-justify-start x-gap-2 x-text-foreground"
            >
              <Icon className="x-size-4" />
              <span className="x-truncate">{model.label}</span>
            </ItemComp>
          </Tooltip>
        );
      })}
    </GroupComp>
  );
}
