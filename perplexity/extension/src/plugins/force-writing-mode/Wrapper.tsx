import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { ForceWritingModeToggle } = lazily(
  () => import("@/plugins/force-writing-mode/ForceWritingMode"),
);

const ForceWritingModeToggleWrapper = withPluginsGuard(ForceWritingModeToggle, {
  dependentPluginIds: ["queryBox:spacesThreadsForceWritingMode"],
});

export default ForceWritingModeToggleWrapper;
