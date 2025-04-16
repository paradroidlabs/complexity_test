import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { QueryMetrics } = lazily(
  () => import("@/plugins/thread-message-length/QueryMetrics"),
);

const ThreadQueryMetricsWrapper = withPluginsGuard(
  () => {
    return (
      <>
        <QueryMetrics />
        <div className="m-[1.5px] w-px border-r border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50 dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-transparent x:h-[21px]" />
      </>
    );
  },
  {
    dependentPluginIds: ["thread:showMessageLength"],
  },
);

export default ThreadQueryMetricsWrapper;
