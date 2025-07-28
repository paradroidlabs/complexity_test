import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

const { default: ThreadMessageToolbarExtraButtonsWrapper } = lazily(
  () => import("@/plugins/_core/ui/groups/thread-message-toolbar/Wrapper"),
);
const { default: ThreadQueryHoverContainerExtraButtonsWrapper } = lazily(
  () =>
    import("@/plugins/_core/ui/groups/thread-query-hover-container/Wrapper"),
);
const { default: BetterCodeBlocksWrapper } = lazily(
  () => import("@/plugins/thread-better-code-blocks/Wrapper"),
);

export function ThreadCometAssistantComponents() {
  return (
    <CsUiPluginsGuard location={["thread_comet_assistant"]}>
      <BetterCodeBlocksWrapper />

      <ThreadQueryHoverContainerExtraButtonsWrapper />

      <ThreadMessageToolbarExtraButtonsWrapper />
    </CsUiPluginsGuard>
  );
}
