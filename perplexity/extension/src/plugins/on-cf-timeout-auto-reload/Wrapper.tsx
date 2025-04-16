import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { OnCloudflareTimeout } = lazily(
  () => import("@/plugins/on-cf-timeout-auto-reload/OnCloudflareTimeout"),
);

const OnCloudflareTimeoutWrapper = withPluginsGuard(OnCloudflareTimeout, {
  dependentPluginIds: ["onCloudflareTimeoutAutoReload"],
});

export default OnCloudflareTimeoutWrapper;
