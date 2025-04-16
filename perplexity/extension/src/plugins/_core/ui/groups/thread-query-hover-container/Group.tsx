import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { ThreadMessageContext } from "@/plugins/_core/ui/groups/thread-message-context";
import normalizeCss from "@/plugins/_core/ui/groups/thread-query-hover-container/normalize.css?inline";
import { useCreatePortalContainers } from "@/plugins/_core/ui/groups/thread-query-hover-container/useCreatePortalContainers";
import ThreadQueryMetricsWrapper from "@/plugins/thread-message-length/QueryWrapper";

declare module "@/plugins/_core/ui/groups/types" {
  interface UiGroupRegistry {
    "thread:messageBlocks:queryHoverContainer": void;
  }
}

export function ThreadQueryHoverContainerExtraButtons() {
  const portalContainers = useCreatePortalContainers();

  useInsertCss({
    css: normalizeCss,
    id: "thread-query-hover-container-normalize",
  });

  return portalContainers.map((portalContainer, messageBlockIndex) => (
    <Portal key={messageBlockIndex} container={portalContainer as HTMLElement}>
      <ThreadMessageContext value={{ messageBlockIndex }}>
        <MemoizedWrapper />
      </ThreadMessageContext>
    </Portal>
  ));
}

const MemoizedWrapper = memo(function MemoizedWrapper() {
  return (
    <div className="x:flex x:h-full x:items-center">
      <ThreadQueryMetricsWrapper />
    </div>
  );
});
