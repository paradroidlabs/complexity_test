import { z } from "zod";

import { BetterCodeBlockGlobalOptionsSchema } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z
  .object({
    enabled: z.boolean(),
  })
  .merge(BetterCodeBlockGlobalOptionsSchema);

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:betterCodeBlocks": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "thread:betterCodeBlocks",
    settingsUiRouteSegment: "thread-better-code-blocks",
    title: "Better Code Blocks",
    description: "Enhance code blocks (in threads)",
    categories: ["thread"],
    tags: ["ui", "codeBlockHighPerformanceImpact"],
    dependentDomObservers: ["thread:codeBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      stickyHeader: true,
      showLineNumbers: false,
      unwrap: {
        enabled: true,
        showToggleButton: true,
      },
      maxHeight: {
        enabled: true,
        collapseByDefault: false,
        value: 500,
        showToggleButton: true,
      },
    },
  },
});
