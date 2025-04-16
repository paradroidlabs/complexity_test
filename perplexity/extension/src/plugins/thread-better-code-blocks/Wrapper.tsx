import { lazily } from "react-lazily";

import { withPluginsGuard } from "@/plugins/_core/plugins-guard/withPluginsGuard";

const { BetterCodeBlocks } = lazily(
  () => import("@/plugins/thread-better-code-blocks/BetterCodeBlocks"),
);

const BetterCodeBlocksWrapper = withPluginsGuard(BetterCodeBlocks, {
  dependentPluginIds: ["thread:betterCodeBlocks"],
});

export default BetterCodeBlocksWrapper;
