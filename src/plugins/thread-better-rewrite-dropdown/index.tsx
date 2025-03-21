import { useQuery } from "@tanstack/react-query";
import { sendMessage } from "webext-bridge/content-script";

import PplxRewrite from "@/components/icons/PplxRewrite";
import Tooltip from "@/components/Tooltip";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  isDeepResearchLanguageModelCode,
  isLanguageModelCode,
  isReasoningLanguageModelCode,
  LanguageModelCode,
} from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import DesktopContent from "@/plugins/language-model-selector/components/desktop";
import MobileContent from "@/plugins/language-model-selector/components/mobile";
import { LanguageModelSelectorContext } from "@/plugins/language-model-selector/context";
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
              ) ||
              isDeepResearchLanguageModelCode(
                modelPreferences.data?.displayModel ?? "",
              ),
          );
          setHighlightedItem(modelPreferences.data?.displayModel ?? null);
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
          isProSearchEnabled,
        });
      }}
    >
      <Tooltip content={t("misc.rewrite")}>
        <DropdownMenuTrigger asChild>
          <div className="x:cursor-pointer x:rounded-lg x:p-2 x:text-muted-foreground x:transition-all x:hover:bg-muted/50 x:hover:text-foreground x:active:scale-95">
            <PplxRewrite className="x:size-4" />
          </div>
        </DropdownMenuTrigger>
      </Tooltip>

      <LanguageModelSelectorContext
        value={{
          component: "dropdown",
          isProSearchEnabled,
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
