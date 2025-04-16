import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { ThreadMessageTtsButton } = lazily(
  () => import("@/plugins/thread-message-tts/ThreadMessageTtsButton"),
);

const ThreadMessageTtsButtonWrapper = withPluginsGuard(ThreadMessageTtsButton, {
  dependentPluginIds: ["thread:messageTts"],
  requiresLoggedIn: true,
});

export default ThreadMessageTtsButtonWrapper;
