import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import type { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";

export function setupStickyToolbars(): () => void {
  const navbarHeightStr =
    document.body.style.getPropertyValue("--navbar-height");
  const navbarHeight = navbarHeightStr ? parseInt(navbarHeightStr) : 53;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const $toolbar = $(entry.target);
        $toolbar.toggleClass("stuck", !entry.isIntersecting);
      });
    },
    {
      threshold: 1.0,
      rootMargin: `-${navbarHeight + 20}px 0px 0px 0px`,
    },
  );

  const handleMessageBlocksUpdate = (messageBlocks: MessageBlock[] | null) => {
    if (!messageBlocks || messageBlocks.length === 0) return;

    const toolbars: HTMLElement[] = messageBlocks
      .map((block: MessageBlock) => block.nodes.$bottomBar[0])
      .filter((el): el is HTMLElement => el !== undefined);

    toolbars.forEach((toolbar: HTMLElement) => observer.observe(toolbar));
  };

  const currentMessageBlocks =
    threadMessageBlocksDomObserverStore.getState().messageBlocks;
  handleMessageBlocksUpdate(currentMessageBlocks);

  const unsubscribe = threadMessageBlocksDomObserverStore.subscribe(
    (store) => store.messageBlocks,
    handleMessageBlocksUpdate,
    {
      equalityFn: (a, b) => a === b, // Simple reference equality
    },
  );

  return () => {
    unsubscribe();
    observer.disconnect();
  };
}
