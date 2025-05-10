import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useThreadMessageContext } from "@/plugins/_core/ui/groups/thread-message-context";
import CopyButton from "@/plugins/thread-better-message-copy-buttons/CopyButton";

export function BetterMessageCopyButton() {
  const { messageBlockIndex } = useThreadMessageContext();

  const sources = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.content.webResults,
    deepEqual,
  );

  const hasSources = sources != null && sources.length > 0;

  return (
    <CopyButton messageBlockIndex={messageBlockIndex} hasSources={hasSources} />
  );
}
