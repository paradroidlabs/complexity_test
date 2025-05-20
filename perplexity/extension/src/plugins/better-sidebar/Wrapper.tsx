import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { BetterSidebar } = lazily(
  () => import("@/plugins/better-sidebar/BetterSidebar"),
);

export const BetterSidebarWrapper = withPluginsGuard(BetterSidebar, {
  dependentPluginIds: ["betterSidebar"],
  requiresLoggedIn: true,
});

export default BetterSidebarWrapper;
