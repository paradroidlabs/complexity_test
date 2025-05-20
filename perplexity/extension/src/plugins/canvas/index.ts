import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:canvas": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

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
