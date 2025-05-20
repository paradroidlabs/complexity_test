import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    cloudflareTimeoutAutoReload: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  behavior: z.enum(["reload", "warn-only"]),
});

export default definePlugin({
  manifest: {
    id: "cloudflareTimeoutAutoReload",
    settingsUiRouteSegment: "cloudflare-timeout-auto-reload",
    title: "Cloudflare Timeout Auto Reload",
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
