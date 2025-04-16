import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";
import { shouldEnableUiGroup } from "@/plugins/_core/ui/groups/utils";

const { ThreadMessageToolbarExtraButtons } = lazily(
  () => import("@/plugins/_core/ui/groups/thread-message-toolbar/Group"),
);

const ThreadMessageToolbarExtraButtonsWrapper = withPluginsGuard(
  ThreadMessageToolbarExtraButtons,
  {
    additionalCheck: () =>
      shouldEnableUiGroup({
        uiGroup: "thread:messageBlocks:toolbar",
      }),
  },
);

export default ThreadMessageToolbarExtraButtonsWrapper;
