import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { SlashCommandMenu } = lazily(
  () => import("@/plugins/slash-command-menu/SlashCommandMenu"),
);

const SlashCommandMenuWrapper = withPluginsGuard(SlashCommandMenu, {
  desktopOnly: true,
  dependentPluginIds: ["queryBox:slashCommandMenu"],
});

export default SlashCommandMenuWrapper;
