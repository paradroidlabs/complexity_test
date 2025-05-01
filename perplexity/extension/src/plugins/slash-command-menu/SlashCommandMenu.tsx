import { PopoverRootProvider } from "@/components/ui/popover";
import { useScopedQueryBoxContext } from "@/plugins/_core/ui/groups/query-box/context/context";
import { getActiveQueryBox } from "@/plugins/_core/ui/groups/query-box/utils";
import { CommandContent } from "@/plugins/slash-command-menu/components/CommandContent";
import { useSlashCommandPopover } from "@/plugins/slash-command-menu/hooks/useSlashCommandPopover";
import { useSlashCommandMenuStore } from "@/plugins/slash-command-menu/store";
import useQueryBoxObserver from "@/plugins/slash-command-menu/useQueryBoxObserver";

type SlashCommandMenuWrapperProps = {
  anchor: HTMLElement | null;
};

export function SlashCommandMenu({ anchor }: SlashCommandMenuWrapperProps) {
  const { store } = useScopedQueryBoxContext();

  const isActive = getActiveQueryBox()[0] === anchor;

  const { isOpen } = useSlashCommandMenuStore();
  const commandRef = useRef<HTMLDivElement>(null);
  const commandInputRef = useRef<HTMLInputElement>(null);

  useQueryBoxObserver({
    queryBoxAnchor: anchor,
    commandRef,
    commandInputRef,
  });
  const popover = useSlashCommandPopover({
    anchor,
  });

  useEffect(() => {
    if (!anchor) return;

    $(anchor).toggleClass(
      cn({
        "x:[&>div>div]:!rounded-t-none":
          (popover.getContentProps() as any)?.["data-placement"] ===
          "top-start",
        "x:[&>div>div]:!rounded-b-none":
          (popover.getContentProps() as any)?.["data-placement"] ===
          "bottom-start",
      }),
      isOpen,
    );
  }, [isOpen, anchor, popover]);

  if (!anchor || !document.contains(anchor) || !isActive) return null;

  return (
    <PopoverRootProvider value={popover} unmountOnExit={true} lazyMount={true}>
      <CommandContent
        commandRef={commandRef}
        commandInputRef={commandInputRef}
        anchor={anchor}
        storeType={store.type}
      />
    </PopoverRootProvider>
  );
}
