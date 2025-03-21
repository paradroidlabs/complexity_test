import { LuCpu } from "react-icons/lu";

import {
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { SelectItem, SelectGroup, SelectLabel } from "@/components/ui/select";
import { languageModelProviderIcons } from "@/data/plugins/query-box/language-model-selector/language-models-icons";
import {
  LanguageModelCode,
  LanguageModelProvider,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { useModelLimits } from "@/plugins/language-model-selector/hooks/useModelLimits";
import { t } from "@/utils/i18next";

type LanguageModel = {
  code: LanguageModelCode;
  label: string;
  provider: LanguageModelProvider;
  description?: string;
  hideFromList?: boolean;
};

type MobileLanguageModelGroupProps = {
  title: string;
  models: LanguageModel[];
};

export default function MobileLanguageModelGroup({
  title,
  models,
}: MobileLanguageModelGroupProps) {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { component } = context;

  const GroupComp = component === "dropdown" ? DropdownMenuGroup : SelectGroup;
  const ItemComp = component === "dropdown" ? DropdownMenuItem : SelectItem;
  const LabelComp = component === "dropdown" ? DropdownMenuLabel : SelectLabel;

  const modelsLimits = useModelLimits();

  return (
    <GroupComp className="x:m-0 x:p-0">
      <LabelComp className="x:text-base">{title}</LabelComp>
      {models.map((model) => {
        if (model.hideFromList) return null;

        const Icon =
          languageModelProviderIcons[
            model.provider as keyof typeof languageModelProviderIcons
          ] ?? LuCpu;

        const modelLimit =
          modelsLimits[model.code as keyof typeof modelsLimits];
        const limit =
          modelLimit === Infinity
            ? t(
                "plugin-model-selectors:languageModelSelector.usesLeft.unlimited",
              )
            : typeof modelLimit === "number"
              ? t(
                  "plugin-model-selectors:languageModelSelector.usesLeft.limited",
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
            className="x:flex x:items-center x:justify-between x:gap-2 x:p-4 x:text-base x:text-foreground"
          >
            <div className="x:flex x:items-center x:gap-2">
              <Icon className="x:size-4" />
              <span className="x:truncate">{model.label}</span>
            </div>
            <div className="x:text-xs x:text-muted-foreground">
              {tooltipContent}
            </div>
          </ItemComp>
        );
      })}
    </GroupComp>
  );
}
