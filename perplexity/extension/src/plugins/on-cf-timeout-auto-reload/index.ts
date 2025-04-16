import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
  behavior: z.enum(["reload", "warn-only"]),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    onCloudflareTimeoutAutoReload: z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "onCloudflareTimeoutAutoReload",
    settingsUiRouteSegment: "on-cloudflare-timeout-auto-reload",
    title: "Auto Reload on Cloudflare Timeout",
    description: "Auto reload the page on Cloudflare timeout",
    categories: ["misc"],
    tags: [],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      behavior: "reload",
    },
  },
});
