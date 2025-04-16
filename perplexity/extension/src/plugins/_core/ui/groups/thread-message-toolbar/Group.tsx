import { Portal } from "@/components/ui/portal";
import { ThreadMessageContext } from "@/plugins/_core/ui/groups/thread-message-context";
import { useCreatePortalContainers } from "@/plugins/_core/ui/groups/thread-message-toolbar/useCreatePortalContainers";
import ThreadBetterMessageCopyButtonWrapper from "@/plugins/thread-better-message-copy-buttons/Wrapper";
import ThreadBetterRewriteDropdownWrapper from "@/plugins/thread-better-rewrite-dropdown/Wrapper";
import ThreadMessageMetricsWrapper from "@/plugins/thread-message-length/MessageWrapper";
import ThreadMessageTtsButtonWrapper from "@/plugins/thread-message-tts/Wrapper";

declare module "@/plugins/_core/ui/groups/types" {
  interface UiGroupRegistry {
    "thread:messageBlocks:toolbar": void;
  }
}

export function ThreadMessageToolbarExtraButtons() {
  const portalContainers = useCreatePortalContainers();

  return portalContainers.map((portalContainer, index) => (
    <Portal key={index} container={portalContainer as HTMLElement}>
      <ThreadMessageContext value={{ messageBlockIndex: index }}>
        <MemoizedWrapper />
      </ThreadMessageContext>
    </Portal>
  ));
}

const MemoizedWrapper = memo(function MemoizedWrapper() {
  return (
    <div className="x:flex x:items-center x:gap-1">
      <ThreadMessageMetricsWrapper />

      <ThreadMessageTtsButtonWrapper />

      <ThreadBetterRewriteDropdownWrapper />

      <ThreadBetterMessageCopyButtonWrapper />
    </div>
  );
});
