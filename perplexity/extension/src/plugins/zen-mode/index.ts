import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";
import { getPlatform } from "@/hooks/usePlatformDetection";

const schema = z.object({
  enabled: z.boolean(),
  persistent: z.boolean(),
  lastState: z.boolean(),
  alwaysHideRelatedQuestions: z.boolean(),
  hotkey: z.array(z.string()),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    zenMode: z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "zenMode",
    settingsUiRouteSegment: "zen-mode",
    title: "Zen Mode",
    description:
      "Hide elements on the page to focus on the content (toggleable). Enable via the Command Menu plugin.",
    categories: ["misc"],
    tags: ["ui", "desktopOnly"],
    dependentMainWorldCorePlugins: ["spaRouter"],
    dependentPlugins: ["commandMenu"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      persistent: false,
      lastState: false,
      alwaysHideRelatedQuestions: false,
      hotkey: [getPlatform() === "mac" ? Key.Meta : Key.Control, Key.Alt, "z"],
    },
  },
});
