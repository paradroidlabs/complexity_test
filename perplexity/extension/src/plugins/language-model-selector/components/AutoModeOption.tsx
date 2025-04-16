import { FaShuffle } from "react-icons/fa6";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { SelectItem } from "@/components/ui/select";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useSharedQueryBoxStore } from "@/plugins/_core/ui/groups/query-box/shared-store";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";

export default function AutoModeOption() {
  const { isMobile } = useIsMobileStore();

  const context = use(LanguageModelSelectorContext);

  if (!context) throw new Error("LanguageModelSelectorContext not found");

  const { component } = context;

  const ItemComp = component === "dropdown" ? DropdownMenuItem : SelectItem;

  const selectedLanguageModel = useSharedQueryBoxStore(
    (store) => store.selectedLanguageModel,
  );

  const extraProps = useMemo(() => {
    if (component === "select") {
      return {
        checkboxOnSingleItem: true,
        checkIconClassName: "x:size-5",
      };
    }
  }, [component]);

  return (
    <ItemComp
      value="pplx_pro"
      item="pplx_pro"
      className={cn("x:w-full x:cursor-pointer x:items-start x:p-2", {
        "x:p-4": isMobile,
      })}
      {...extraProps}
    >
      <div className="x:flex x:items-start x:justify-start x:gap-2">
        <FaShuffle
          className={cn("x:mt-1 x:size-3.5 x:text-foreground", {
            "x:text-primary":
              component === "select" && selectedLanguageModel === "pplx_pro",
            "x:size-4": isMobile,
          })}
        />
        <div className="x:flex x:flex-col x:gap-y-0.5">
          <div
            className={cn("x:font-medium x:text-foreground", {
              "x:text-primary":
                component === "select" && selectedLanguageModel === "pplx_pro",
              "x:text-lg": isMobile,
            })}
          >
            {t("plugin-model-selectors:languageModelSelector:autoMode.title")}
          </div>
          <div
            className={cn("x:text-muted-foreground", {
              "x:text-xs": !isMobile,
            })}
          >
            {t(
              "plugin-model-selectors:languageModelSelector:autoMode.description",
            )}
          </div>
        </div>
      </div>
    </ItemComp>
  );
}
