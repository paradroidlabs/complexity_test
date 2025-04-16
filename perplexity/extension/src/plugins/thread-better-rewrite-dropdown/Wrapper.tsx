import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { ThreadBetterRewriteDropdown } = lazily(
  () =>
    import(
      "@/plugins/thread-better-rewrite-dropdown/ThreadBetterRewriteDropdown"
    ),
);

const ThreadBetterRewriteDropdownWrapper = withPluginsGuard(
  ThreadBetterRewriteDropdown,
  {
    dependentPluginIds: ["thread:betterRewriteDropdowns"],
    requiresLoggedIn: true,
    allowedAccountTypes: [["pro"], ["pro", "enterprise"]],
  },
);

export default ThreadBetterRewriteDropdownWrapper;
