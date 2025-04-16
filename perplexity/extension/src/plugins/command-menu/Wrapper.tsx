import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { CommandMenu } = lazily(
  () => import("@/plugins/command-menu/CommandMenu"),
);

const CommandMenuWrapper = withPluginsGuard(CommandMenu, {
  dependentPluginIds: ["commandMenu"],
});

export default CommandMenuWrapper;
