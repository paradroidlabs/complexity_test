import { PopoverContent } from "@/components/ui/popover";
import { Tabs, TabsList } from "@/components/ui/tabs";
import {
  PromptHistorySlashCommandMenuTabContent,
  PromptHistorySlashCommandMenuTabTrigger,
} from "@/plugins/prompt-history/index.public";
import { useBlurHandler } from "@/plugins/slash-command/hooks/useBlurHandler";
import {
  slashCommandMenuStore,
  useSlashCommandMenuStore,
} from "@/plugins/slash-command/store";
import type { ContentTabId } from "@/plugins/slash-command/store/slices/content-tab";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";

export default function CommandContent() {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useBlurHandler({
    contentRef,
    exceptionalElementSelectors: ["[data-prompt-history-clear-all-dialog]"],
  });

  const activeContentTab = useSlashCommandMenuStore(
    (store) => store.activeContentTab,
  );

  // TODO: refactor tab -> page, similar to command menu

  return (
    <PopoverContent
      ref={contentRef}
      data-slash-command-menu-content
      className={cn(
        PPLX_SCROLLBAR_CLASSES,
        "x:w-(--reference-width) x:overflow-x-hidden x:rounded-2xl x:border-border/80 x:bg-secondary x:p-0 x:shadow-lg",
      )}
      onKeyDown={(e) => {
        if (e.key === Key.Escape) {
          slashCommandMenuStore.getState().setOpen(false);
        }
      }}
    >
      <Tabs
        orientation="vertical"
        className="x:flex x:flex-row"
        value={activeContentTab}
        onValueChange={({ value }) => {
          slashCommandMenuStore
            .getState()
            .setActiveContentTab(value as ContentTabId);
        }}
      >
        <div className="x:max-h-[calc(var(--available-height)-50px)] x:w-full x:*:h-full">
          <PromptHistorySlashCommandMenuTabContent />
        </div>
        {/* <TabsList
          className={cn(
            PPLX_SCROLLBAR_CLASSES,
            "x:flex-col x:justify-start x:overflow-x-hidden x:overflow-y-auto x:rounded-none x:border-l x:border-border/50 x:bg-secondary x:p-0 x:transition-all x:empty:hidden x:dark:bg-background",
          )}
        >
          <PromptHistorySlashCommandMenuTabTrigger />
        </TabsList> */}
      </Tabs>
    </PopoverContent>
  );
}
