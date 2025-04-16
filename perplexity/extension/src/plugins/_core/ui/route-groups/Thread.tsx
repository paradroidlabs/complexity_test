import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

const { default: ThreadMessageToolbarExtraButtonsWrapper } = lazily(
  () => import("@/plugins/_core/ui/groups/thread-message-toolbar/Wrapper"),
);
const { default: ThreadQueryHoverContainerExtraButtonsWrapper } = lazily(
  () =>
    import("@/plugins/_core/ui/groups/thread-query-hover-container/Wrapper"),
);
const { default: CanvasWrapper } = lazily(
  () => import("@/plugins/canvas/Wrapper"),
);
const { default: ExportThreadWrapper } = lazily(
  () => import("@/plugins/export-thread/Wrapper"),
);
const { default: ImageGenModelSelectorWrapper } = lazily(
  () => import("@/plugins/image-gen-popover/Wrapper"),
);
const { default: BetterCodeBlocksWrapper } = lazily(
  () => import("@/plugins/thread-better-code-blocks/Wrapper"),
);
const { default: ThreadTocWrapper } = lazily(
  () => import("@/plugins/thread-toc/Wrapper"),
);

export default function ThreadComponents() {
  return (
    <CsUiPluginsGuard location={["thread"]}>
      <ImageGenModelSelectorWrapper />

      <CanvasWrapper />

      <BetterCodeBlocksWrapper />

      <ThreadTocWrapper />

      <ExportThreadWrapper />

      <ThreadQueryHoverContainerExtraButtonsWrapper />

      <ThreadMessageToolbarExtraButtonsWrapper />
    </CsUiPluginsGuard>
  );
}
