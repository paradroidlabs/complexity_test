import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { MessageMetrics } = lazily(
  () => import("@/plugins/thread-message-length/MessageMetrics"),
);

const ThreadMessageMetricsWrapper = withPluginsGuard(MessageMetrics, {
  dependentPluginIds: ["thread:showMessageLength"],
});

export default ThreadMessageMetricsWrapper;
