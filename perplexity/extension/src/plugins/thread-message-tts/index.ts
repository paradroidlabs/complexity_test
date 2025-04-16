import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";
import { TtsVoiceSchema } from "@/data/plugins/thread-message-tts/types";

const schema = z.object({
  enabled: z.boolean(),
  voice: TtsVoiceSchema,
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:messageTts": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "thread:messageTts",
    settingsUiRouteSegment: "thread-message-tts",
    title: "Text-to-Speech",
    description: "Enable text-to-speech for messages in threads",
    categories: ["thread"],
    tags: ["new", "ui"],
    dependentDomObservers: ["thread:messageBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
    uiGroup: ["thread:messageBlocks:toolbar"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      voice: "Mike",
    },
  },
});
