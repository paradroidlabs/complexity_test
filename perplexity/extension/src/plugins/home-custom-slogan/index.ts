import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
  slogan: z.string(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "home:customSlogan": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "home:customSlogan",
    settingsUiRouteSegment: "home-custom-slogan",
    title: "Custom Home Slogan",
    description: "Customize the slogan on the homepage",
    categories: ["misc"],
    tags: ["ui", "forFun"],
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
