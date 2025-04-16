import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { TriggerButton } = lazily(
  () => import("@/plugins/slash-command-menu/TriggerButton"),
);

const SlashCommandMenuTriggerButtonWrapper = withPluginsGuard(TriggerButton, {
  desktopOnly: true,
  dependentPluginIds: ["queryBox:slashCommandMenu"],
  additionalCheck: ({ settings }) =>
    settings?.plugins["queryBox:slashCommandMenu"].showTriggerButton,
});

export default SlashCommandMenuTriggerButtonWrapper;
