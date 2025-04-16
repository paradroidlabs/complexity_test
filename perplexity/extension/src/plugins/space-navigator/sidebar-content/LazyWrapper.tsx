import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { SpaceNavigatorWrapper } = lazily(
  () =>
    import("@/plugins/space-navigator/sidebar-content/SpaceNavigatorWrapper"),
);

const SpaceNavigatorLazyWrapper = withPluginsGuard(SpaceNavigatorWrapper, {
  dependentPluginIds: ["spaceNavigator"],
  allowIncognito: false,
  requiresLoggedIn: true,
  desktopOnly: true,
});

export default SpaceNavigatorLazyWrapper;
