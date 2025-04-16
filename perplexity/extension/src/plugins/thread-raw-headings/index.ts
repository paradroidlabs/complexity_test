import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:rawHeadings": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "thread:rawHeadings",
    settingsUiRouteSegment: "thread-raw-headings",
    title: "Raw Headings",
    description: "Prevent headings from being rendered as follow-up links",
    categories: ["thread"],
    tags: ["new", "ui"],
    dependentDomObservers: ["thread:messageBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
