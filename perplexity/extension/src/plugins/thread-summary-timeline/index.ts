import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";
import { Wrapper } from "./Wrapper";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread-summary-timeline": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "thread-summary-timeline",
    settingsUiRouteSegment: "thread-summary-timeline",
    title: "Thread Summary Timeline",
    description: "Displays a timeline with summaries of the thread.",
    categories: ["thread"],
    tags: ["ui", "summary"],
    dependentDomObservers: ["thread:messageBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: true,
    },
  },
  contentScripts: {
    "thread:once": {
      render: async () => Wrapper,
    },
  },
});
