import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";
import { shouldEnableUiGroup } from "@/plugins/_core/ui/groups/utils";

const { ThreadQueryHoverContainerExtraButtons } = lazily(
  () => import("@/plugins/_core/ui/groups/thread-query-hover-container/Group"),
);

const ThreadQueryHoverContainerExtraButtonsWrapper = withPluginsGuard(
  ThreadQueryHoverContainerExtraButtons,
  {
    additionalCheck: () =>
      shouldEnableUiGroup({
        uiGroup: "thread:messageBlocks:queryHoverContainer",
      }),
  },
);

export default ThreadQueryHoverContainerExtraButtonsWrapper;
