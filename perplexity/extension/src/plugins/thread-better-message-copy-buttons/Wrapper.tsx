import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { BetterMessageCopyButton } = lazily(
  () =>
    import(
      "@/plugins/thread-better-message-copy-buttons/ThreadBetterMessageCopyButton"
    ),
);

const ThreadBetterMessageCopyButtonWrapper = withPluginsGuard(
  BetterMessageCopyButton,
  {
    dependentPluginIds: ["thread:betterMessageCopyButtons"],
  },
);

export default ThreadBetterMessageCopyButtonWrapper;
