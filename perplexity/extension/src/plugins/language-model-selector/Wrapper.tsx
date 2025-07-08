import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { LanguageModelSelector } = lazily(
  () => import("@/plugins/language-model-selector/LanguageModelSelector"),
);

const BetterLanguageModelSelectorWrapper = withPluginsGuard(
  LanguageModelSelector,
  {
    dependentPluginIds: ["queryBox:languageModelSelector"],
    mustHaveActiveSub: true,
    leastTier: "pro",
  },
);

export default BetterLanguageModelSelectorWrapper;
