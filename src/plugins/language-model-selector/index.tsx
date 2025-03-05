import { createListCollection } from "@ark-ui/react";

import { Select, SelectContext, SelectTrigger } from "@/components/ui/select";
import {
  fastLanguageModels,
  reasoningLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";
import {
  isFastLanguageModelCode,
  isReasoningLanguageModelCode,
  LanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import useBindBetterLanguageModelSelectorHotKeys from "@/plugins/_core/ui-groups/query-box/hooks/useBindHotKeys";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";
import DesktopContent from "@/plugins/language-model-selector/components/desktop";
import MobileContent from "@/plugins/language-model-selector/components/mobile";
import BetterLanguageModelSelectorTriggerButton from "@/plugins/language-model-selector/components/TriggerButton";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { useColumnNavigation } from "@/plugins/language-model-selector/hooks/useColumnNavigation";
import { PplxUserSettingsApiResponse } from "@/services/pplx-api/pplx-api.types";
import { pplxApiQueries } from "@/services/pplx-api/query-keys";
import { TEST_ID_SELECTORS } from "@/utils/dom-selectors";
import { queryClient } from "@/utils/ts-query-client";
import { UiUtils } from "@/utils/ui-utils";

const selectItems = [...fastLanguageModels, ...reasoningLanguageModels].map(
  (model) => ({
    id: model.code,
    label: model.label,
  }),
);

export default function BetterLanguageModelSelectorWrapper() {
  const { isMobile } = useIsMobileStore();
  const {
    selectedLanguageModel,
    setSelectedLanguageModel,
    isProSearchEnabled,
    setIsProSearchEnabled,
  } = useSharedQueryBoxStore((store) => ({
    selectedLanguageModel: store.selectedLanguageModel,
    setSelectedLanguageModel: store.setSelectedLanguageModel,
    isProSearchEnabled: store.isProSearchEnabled,
    setIsProSearchEnabled: store.setIsProSearchEnabled,
  }));
  const [highlightedItem, setHighlightedItem] = useState<LanguageModelCode>(
    selectedLanguageModel,
  );
  const [isOpen, setIsOpen] = useState(false);
  const hotkeyRef = useColumnNavigation({
    highlightedItem,
    setHighlightedItem,
    enabled: isOpen,
  });

  useBindBetterLanguageModelSelectorHotKeys();

  return (
    <Select
      lazyMount
      unmountOnExit
      portal={false}
      collection={createListCollection({
        items: selectItems,
        itemToString: (item) => item.label,
        itemToValue: (item) => item.id,
      })}
      data-testid={TEST_ID_SELECTORS.QUERY_BOX.LANGUAGE_MODEL_SELECTOR}
      open={isOpen}
      value={[selectedLanguageModel]}
      highlightedValue={highlightedItem}
      onOpenChange={({ open }) => setIsOpen(open)}
      onValueChange={({ value }) => {
        setSelectedLanguageModel(value[0] as LanguageModelCode);
        setTimeout(() => {
          UiUtils.getActiveQueryBoxTextarea().trigger("focus");
        }, 100);
      }}
      onHighlightChange={({ highlightedValue }) =>
        setHighlightedItem(highlightedValue as LanguageModelCode)
      }
      onKeyDown={(event) => {
        if (event.key === Key.Escape) {
          event.preventDefault();
          event.stopPropagation();
          setTimeout(() => {
            UiUtils.getActiveQueryBoxTextarea().trigger("focus");
          }, 100);
        }
      }}
    >
      <SelectTrigger variant="noStyle" className="x-m-0 x-p-0">
        <BetterLanguageModelSelectorTriggerButton />
      </SelectTrigger>
      <LanguageModelSelectorContext
        value={{
          component: "select",
          isProSearchEnabled,
          hotkeyRef,
          setIsProSearchEnabled: (isEnabled) => {
            setIsProSearchEnabled(isEnabled);

            if (isEnabled) return;

            if (!isReasoningLanguageModelCode(selectedLanguageModel)) return;

            const userSettings =
              queryClient.getQueryData<PplxUserSettingsApiResponse>(
                pplxApiQueries.userSettings.queryKey,
              );

            if (
              userSettings?.default_model == null ||
              !isFastLanguageModelCode(userSettings?.default_model)
            )
              return;

            setHighlightedItem(userSettings?.default_model);
          },
          setHighlightedItem,
        }}
      >
        {isMobile ? (
          <SelectContext>
            {({ open, setOpen }) => (
              <MobileContent
                open={open}
                onOpenChange={({ open }) => setOpen(open)}
              />
            )}
          </SelectContext>
        ) : (
          <DesktopContent />
        )}
      </LanguageModelSelectorContext>
    </Select>
  );
}
