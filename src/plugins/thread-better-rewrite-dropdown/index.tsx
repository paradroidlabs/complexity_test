import { useQuery } from "@tanstack/react-query";
import { sendMessage } from "webext-bridge/content-script";

import PplxRewrite from "@/components/icons/PplxRewrite";
import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  isReasoningLanguageModelCode,
  LanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import DesktopContent from "@/plugins/language-model-selector/components/desktop";
import MobileContent from "@/plugins/language-model-selector/components/mobile";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
import { useColumnNavigation } from "@/plugins/language-model-selector/hooks/useColumnNavigation";
import { handleRewrite } from "@/plugins/thread-better-rewrite-dropdown/handle-rewrite";

export default function ThreadBetterRewriteDropdown({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const { isMobile } = useIsMobileStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isProSearchEnabled, setIsProSearchEnabled] = useState(false);
  const [highlightedItem, setHighlightedItem] =
    useState<LanguageModelCode | null>("claude2");
  const isReadOnly = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.states.isReadOnly,
    deepEqual,
  );
  const hotkeyRef = useColumnNavigation({
    highlightedItem: highlightedItem ?? "",
    setHighlightedItem,
    enabled: isOpen,
  });

  const { refetch: fetchMessageModelPreferences } = useQuery({
    queryKey: ["messageModelPreferences", messageBlockIndex],
    queryFn: () =>
      sendMessage(
        "reactVdom:getMessageModelPreferences",
        { index: messageBlockIndex },
        "window",
      ),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

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
          const modelPreferences = await fetchMessageModelPreferences();

          setIsProSearchEnabled(
            modelPreferences.data?.mode.toLowerCase() === "copilot" ||
              isReasoningLanguageModelCode(
                modelPreferences.data?.displayModel ?? "",
              ),
          );
          setHighlightedItem(modelPreferences.data?.displayModel ?? null);
        }

        setIsOpen(open);
      }}
      onHighlightChange={({ highlightedValue }) => {
        setHighlightedItem(highlightedValue);
      }}
      onSelect={({ value }) => {
        handleRewrite({
          selectedModel: value,
          messageBlockIndex,
          isProSearchEnabled,
        });
      }}
    >
      <Tooltip content={t("misc.rewrite")}>
        <DropdownMenuTrigger asChild>
          <div className="x-cursor-pointer x-rounded-md x-p-2 x-text-muted-foreground x-transition-all hover:x-bg-muted/50 hover:x-text-foreground active:x-scale-95">
            <PplxRewrite className="x-size-4" />
          </div>
        </DropdownMenuTrigger>
      </Tooltip>

      <LanguageModelSelectorContext
        value={{
          component: "dropdown",
          isProSearchEnabled,
          hotkeyRef,
          setIsProSearchEnabled,
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
