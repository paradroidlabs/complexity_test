import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { ThreadToc } = lazily(() => import("@/plugins/thread-toc/ThreadToc"));

export const ThreadTocWrapper = withPluginsGuard(ThreadToc, {
  dependentPluginIds: ["thread:toc"],
});

export default ThreadTocWrapper;
