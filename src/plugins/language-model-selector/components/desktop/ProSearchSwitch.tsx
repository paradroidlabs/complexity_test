import ProSearchIcon from "@/components/icons/ProSearchIcon";
import { Switch } from "@/components/ui/switch";
import {
  isFastLanguageModelCode,
  isReasoningLanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui-groups/query-box/shared-store";

export default function ProSearchSwitch({
  setHighlightedItem,
}: {
  setHighlightedItem: (item: string) => void;
}) {
  const { selectedLanguageModel } = useSharedQueryBoxStore((store) => ({
    selectedLanguageModel: store.selectedLanguageModel,
  }));

  const { isProSearchEnabled, setIsProSearchEnabled } = useSharedQueryBoxStore(
    (store) => ({
      isProSearchEnabled: store.isProSearchEnabled,
      setIsProSearchEnabled: store.setIsProSearchEnabled,
    }),
  );

  const { data: userSettings } = usePplxUserSettings();

  const handleToggleOff = useCallback(
    (checked: boolean) => {
      if (checked) return;

      if (!isReasoningLanguageModelCode(selectedLanguageModel)) return;

      if (
        userSettings?.default_model == null ||
        !isFastLanguageModelCode(userSettings?.default_model)
      )
        return;

      setHighlightedItem(userSettings?.default_model);
    },
    [selectedLanguageModel, setHighlightedItem, userSettings?.default_model],
  );

  return (
    <div className="x-flex x-w-full x-items-center x-justify-between x-gap-4">
      <div
        className={cn(
          "x-items-start x-flex x-gap-2 x-transition-all",
          isProSearchEnabled && "x-text-primary",
        )}
      >
        <ProSearchIcon className="x-size-4" />
        <div className="x-flex x-flex-col x-gap-y-0.5">
          <div className="x-text-sm x-font-medium">Pro Search</div>
          <div className="x-text-xs x-text-muted-foreground">
            {t(
              "plugin-model-selectors:languageModelSelector.proSearch.tooltip",
            )}
          </div>
        </div>
      </div>
      <Switch
        size="sm"
        checked={isProSearchEnabled}
        onCheckedChange={({ checked }) => {
          setIsProSearchEnabled(checked);
          handleToggleOff(checked);
        }}
      />
    </div>
  );
}
