import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { CloudflareTimeoutActionDialog } = lazily(
  () => import("@/plugins/cloudflare-timeout-auto-reload/ActionDialog"),
);

const CloudflareTimeoutActionDialogWrapper = withPluginsGuard(
  CloudflareTimeoutActionDialog,
  {
    dependentPluginIds: ["cloudflareTimeoutAutoReload"],
  },
);

export default CloudflareTimeoutActionDialogWrapper;
