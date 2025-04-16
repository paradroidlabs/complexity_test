import PplxRewrite from "@/components/icons/PplxRewrite";
import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { isLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import {
  threadMessageBlocksDomObserverStore,
  useThreadMessageBlocksDomObserverStore,
} from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useRegisterGlobalCssEntry } from "@/plugins/_core/global-stores/global-css-store";
import { useThreadMessageContext } from "@/plugins/_core/ui/groups/thread-message-context";
import DesktopContent from "@/plugins/language-model-selector/components/desktop";
import MobileContent from "@/plugins/language-model-selector/components/mobile";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { handleRewrite } from "@/plugins/thread-better-rewrite-dropdown/handle-rewrite";

export function ThreadBetterRewriteDropdown() {
  const { messageBlockIndex } = useThreadMessageContext();

  const { isMobile } = useIsMobileStore();
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedItem, setHighlightedItem] =
    useState<LanguageModelCode | null>("claude2");

  useRegisterGlobalCssEntry({
    entryIds: ["thread-message-toolbar-hide-native-rewrite-dropdowns"],
    subscriberId: "thread-better-rewrite-dropdown#" + messageBlockIndex,
  });

  const isReadOnly = useThreadMessageBlocksDomObserverStore((store) => {
    return store.messageBlocks?.[messageBlockIndex]?.states.isReadOnly;
  }, deepEqual);

  if (isReadOnly) return null;

  return (
    <DropdownMenu
      lazyMount
      unmountOnExit
      open={isOpen}
      highlightedValue={highlightedItem}
      positioning={{
        placement: "bottom-end",
      }}
      onOpenChange={async ({ open }) => {
        if (open) {
          const modelPreferences =
            threadMessageBlocksDomObserverStore.getState().messageBlocks?.[
              messageBlockIndex
            ]?.content.displayModel;
          setHighlightedItem(modelPreferences ?? null);
        }

        setIsOpen(open);
      }}
      onHighlightChange={({ highlightedValue }) => {
        if (highlightedValue && isLanguageModelCode(highlightedValue)) {
          setHighlightedItem(highlightedValue);
        }
      }}
      onSelect={({ value }) => {
        handleRewrite({
          selectedModel: value as LanguageModelCode,
          messageBlockIndex,
        });
      }}
    >
      <Tooltip content={t("misc.rewrite")}>
        <DropdownMenuTrigger asChild>
          <div
            className="x:cursor-pointer x:rounded-lg x:p-2 x:text-muted-foreground x:transition-all x:hover:bg-muted/50 x:hover:text-foreground x:active:scale-95"
            tabIndex={0}
          >
            <PplxRewrite className="x:size-4" />
          </div>
        </DropdownMenuTrigger>
      </Tooltip>

      <LanguageModelSelectorContext
        value={{
          component: "dropdown",
          setHighlightedItem,
        }}
      >
        {isMobile ? (
          <MobileContent
            open={isOpen}
            onOpenChange={({ open }) => setIsOpen(open)}
          />
        ) : (
          <DesktopContent />
        )}
      </LanguageModelSelectorContext>
    </DropdownMenu>
  );
}
