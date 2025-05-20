import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "home:customSlogan": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  slogan: z.string(),
});

export default definePlugin({
  manifest: {
    id: "home:customSlogan",
    settingsUiRouteSegment: "home-custom-slogan",
    title: "Custom Home Slogan",
    description: "Customize the slogan on the homepage",
    categories: ["misc"],
    tags: ["ui"],
    dependentDomObservers: ["home"],
    dependentMainWorldCorePlugins: ["spaRouter"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      slogan: "",
    },
  },
});
