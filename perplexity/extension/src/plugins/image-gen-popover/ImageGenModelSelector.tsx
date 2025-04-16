import { createListCollection } from "@ark-ui/react";
import { LuCpu as Cpu, LuImage as Image } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Portal } from "@/components/ui/portal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ImageGenModel } from "@/data/plugins/image-gen-model-selector/image-gen-model-seletor.types";
import { imageGenModels } from "@/data/plugins/image-gen-model-selector/image-gen-models";
import { imageGenModelIcons } from "@/data/plugins/image-gen-model-selector/image-gen-models-icons";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";
import { useImageGenModelSelectorStore } from "@/plugins/image-gen-popover/store";
import useObserver from "@/plugins/image-gen-popover/useObserver";
import { isReactNode } from "@/types/utils.types";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";

export function ImageGenModelSelector() {
  const portalContainer = useObserver();

  const { data: pplxUserSettings } = usePplxUserSettings();

  const limit = pplxUserSettings?.create_limit ?? 0;

  const { selectedImageGenModel: value, setSelectedImageGenModel: setValue } =
    useImageGenModelSelectorStore(
      ({ selectedImageGenModel, setSelectedImageGenModel }) => ({
        selectedImageGenModel,
        setSelectedImageGenModel,
      }),
    );

  const handleValueChange = (details: { value: string[] }) => {
    setValue(details.value[0] as ImageGenModel["code"]);
  };

  return (
    <Portal container={portalContainer}>
      <Select
        data-testid={TEST_ID_SELECTORS.QUERY_BOX.IMAGE_GEN_MODEL_SELECTOR}
        collection={createListCollection({
          items: imageGenModels.map((model) => model.code),
        })}
        className="x:mb-4 x:ml-auto x:w-fit"
        value={[value]}
        onValueChange={handleValueChange}
      >
        <Tooltip
          content={t("plugin-model-selectors:imageGenModelSelector.tooltip")}
          positioning={{
            gutter: 8,
          }}
        >
          <SelectTrigger variant="ghost">
            <div className="x:flex x:min-h-8 x:items-center x:justify-center x:gap-1">
              <Image className="x:size-4" />
              <SelectValue className="x:font-medium">
                {
                  imageGenModels.find((model) => model.code === value)
                    ?.shortLabel
                }
              </SelectValue>
              <span className="x:self-start x:text-[.5rem] x:text-primary">
                {limit}
              </span>
            </div>
          </SelectTrigger>
        </Tooltip>
        <SelectContent
          className={cn(
            PPLX_SCROLLBAR_CLASSES,
            "x:max-h-[500px] x:max-w-[200px] x:overflow-auto x:font-sans",
          )}
        >
          {imageGenModels.map((model) => {
            const Icon = imageGenModelIcons[model.code];
            return (
              <Tooltip
                key={model.code}
                content={limit}
                positioning={{
                  placement: "right",
                  gutter: 10,
                }}
              >
                <SelectItem
                  key={model.code}
                  item={model.code}
                  className="x:font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <div className="x:flex x:max-w-full x:items-center x:justify-around x:gap-2">
                    {isReactNode(<Icon />) ? (
                      <div className="x:text-[1.1rem]">
                        <Icon className="x:size-4" />
                      </div>
                    ) : (
                      <Cpu className="x:size-4" />
                    )}
                    <span className="x:truncate">{model.label}</span>
                  </div>
                </SelectItem>
              </Tooltip>
            );
          })}
        </SelectContent>
      </Select>
    </Portal>
  );
}
