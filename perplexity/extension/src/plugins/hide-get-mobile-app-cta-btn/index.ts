import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "hide-get-mobile-app-cta-btn": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "hide-get-mobile-app-cta-btn",
    settingsUiRouteSegment: "hide-get-mobile-app-cta-btn",
    title: 'Hide "Get Mobile App" Button',
    description: 'Hide all "Get Mobile App" buttons on mobile screens',
    categories: ["misc"],
    tags: ["ui"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
