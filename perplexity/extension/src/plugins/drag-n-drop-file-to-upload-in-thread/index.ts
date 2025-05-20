import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:dragAndDropFileToUploadInThread": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "thread:dragAndDropFileToUploadInThread",
    settingsUiRouteSegment: "thread-drag-and-drop-file-to-upload-in-thread",
    title: "Drag and Drop File(s) to Upload",
    description:
      "Treat the whole thread page as a drop zone and allow you to directly drag & drop file(s) to upload them as attachment(s)",
    categories: ["thread"],
    tags: ["ui", "desktopOnly"],
    dependentMainWorldCorePlugins: ["spaRouter"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
