import ProSearchIcon from "@/components/icons/ProSearchIcon";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";

export default function ProSearchSwitch() {
  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { isProSearchEnabled, setIsProSearchEnabled, component } = context;

  const indicator = useMemo(() => {
    if (component === "select") {
      return <Switch size="sm" checked={isProSearchEnabled} />;
    }

    return <Checkbox size="lg" checked={isProSearchEnabled} />;
  }, [component, isProSearchEnabled]);

  return (
    <div
      className="x-flex x-w-full x-items-start x-justify-between x-gap-4 x-p-4"
      onClick={() => {
        setIsProSearchEnabled(!isProSearchEnabled);
      }}
    >
      <div
        className={cn(
          "x-flex x-items-baseline x-gap-2 x-transition-all",
          isProSearchEnabled && "x-text-primary",
        )}
      >
        <ProSearchIcon className="x-size-4" />
        <div className="x-flex x-flex-col x-gap-y-1">
          <div className="x-text-lg x-font-medium">Pro Search</div>
          <div className="x-text-sm x-text-muted-foreground">
            {t(
              "plugin-model-selectors:languageModelSelector.proSearch.tooltip",
            )}
          </div>
        </div>
      </div>
      {indicator}
    </div>
  );
}
