import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:canvas": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "thread:canvas",
    settingsUiRouteSegment: "thread-canvas",
    title: "Canvas",
    description:
      "Visualize and interact with generated content side by side - similar to claude.ai's artifacts",
    categories: ["thread"],
    tags: ["desktopOnly", "ui"],
    dependentPlugins: ["thread:betterCodeBlocks"],
    dependentDomObservers: ["thread:messageBlocks", "thread:codeBlocks"],
    dependentMainWorldCorePlugins: [
      "spaRouter",
      "mermaidRenderer",
      "markmapRenderer",
    ],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
