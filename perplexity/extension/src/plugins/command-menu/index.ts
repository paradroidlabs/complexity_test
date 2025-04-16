import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";
import { getPlatform } from "@/hooks/usePlatformDetection";

const schema = z.object({
  enabled: z.boolean(),
  hotkey: z.array(z.string()),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    commandMenu: z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "commandMenu",
    settingsUiRouteSegment: "command-menu",
    title: "Command Menu",
    description: "Quickly navigate around and invoke actions",
    categories: ["misc"],
    tags: ["ui", "desktopOnly"],
    dependentMainWorldCorePlugins: ["spaRouter", "webSocket"],
  },
  settingsSchema: {
    schema,
    fallback: {
      hotkey: [
        getPlatform() === "mac" ? Key.Meta : Key.Control,
        getPlatform() === "mac" ? "i" : "k",
      ],
      enabled: false,
    },
  },
});
