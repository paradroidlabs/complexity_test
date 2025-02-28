import { z } from "zod";

import { BetterCodeBlockGlobalOptionsSchema } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { TtsVoiceSchema } from "@/data/plugins/thread-message-tts/types";

export const PluginSettingsSchema = z.object({
  enabled: z.boolean(),
});

export type PluginSettings = z.infer<typeof PluginSettingsSchema>;

export const PluginsSchema = z.object({
  "queryBox:languageModelSelector": PluginSettingsSchema.extend({
    respectDefaultSpaceModel: z.boolean(),
    changeTimezone: z.boolean(),
  }),
  "queryBox:fullWidthFollowUp": PluginSettingsSchema,
  "queryBox:slashCommandMenu": PluginSettingsSchema.extend({
    showTriggerButton: z.boolean(),
  }),
  "queryBox:slashCommandMenu:promptHistory": PluginSettingsSchema.extend({
    trigger: z.object({
      onSubmit: z.boolean(),
      onNavigation: z.boolean(),
    }),
  }),
  "queryBox:noFileCreationOnPaste": PluginSettingsSchema,
  commandMenu: PluginSettingsSchema.extend({
    hotkey: z.array(z.string()),
  }),
  "queryBox:submitOnCtrlEnter": PluginSettingsSchema,
  spaceNavigator: PluginSettingsSchema,
  "sidebar:toggleableRecentThreads": PluginSettingsSchema,
  "thread:toc": PluginSettingsSchema,
  "thread:rawHeadings": PluginSettingsSchema,
  "thread:betterMessageToolbars": PluginSettingsSchema.extend({
    sticky: z.boolean(),
    editQueryButton: z.boolean(),
    explicitModelName: z.boolean(),
    wordsAndCharactersCount: z.boolean(),
    tokensCount: z.boolean(),
    collapsibleQuery: z.boolean(),
    dynamicQueryFontSize: z.boolean(),
  }),
  "thread:messageTts": PluginSettingsSchema.extend({
    voice: TtsVoiceSchema,
  }),
  "thread:instantRewriteButton": PluginSettingsSchema,
  "thread:betterCodeBlocks": PluginSettingsSchema.merge(
    BetterCodeBlockGlobalOptionsSchema,
  ),
  "thread:canvas": PluginSettingsSchema,
  "thread:exportThread": PluginSettingsSchema,
  "thread:betterMessageCopyButtons": PluginSettingsSchema,
  "thread:dragAndDropFileToUploadInThread": PluginSettingsSchema,
  "thread:collapseEmptyThreadVisualCols": PluginSettingsSchema,
  imageGenModelSelector: PluginSettingsSchema,
  onCloudflareTimeoutAutoReload: PluginSettingsSchema.extend({
    behavior: z.enum(["reload", "warn-only"]),
  }),
  "thread:customThreadContainerWidth": PluginSettingsSchema.extend({
    value: z.number(),
  }),
  blockAnalyticEvents: PluginSettingsSchema,
  "home:customSlogan": PluginSettingsSchema.extend({
    slogan: z.string(),
  }),
  "home:hideHomepageWidgets": PluginSettingsSchema,
  "hide-get-mobile-app-cta-btn": PluginSettingsSchema,
  zenMode: PluginSettingsSchema.extend({
    persistent: z.boolean(),
    lastState: z.boolean(),
    alwaysHideRelatedQuestions: z.boolean(),
    alwaysHideVisualCols: z.boolean(),
    hotkey: z.array(z.string()),
  }),
});

export type Plugins = z.infer<typeof PluginsSchema>;
export type PluginId = keyof Plugins;

export function isPluginId(value: string): value is PluginId {
  return Object.keys(PluginsSchema.shape).includes(value);
}
