import { z } from "zod";

import { BetterCodeBlockFineGrainedOptionsSchema } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { PromptHistorySchema } from "@/data/plugins/prompt-history/prompt-history.type";
import { ThemeSchema } from "@/data/plugins/themes/theme-registry.types";
import { ExtensionSettingsSchema } from "@/services/extension-settings/types";

export const ExtensionDataSchema = z.object({
  settings: z.object({
    settings: ExtensionSettingsSchema,
    settings$: z.object({
      v: z.number(),
    }),
  }),
  db: z.object({
    themes: z.array(ThemeSchema),
    betterCodeBlocksFineGrainedOptions: z.array(
      BetterCodeBlockFineGrainedOptionsSchema,
    ),
    promptHistory: z.array(PromptHistorySchema),
  }),
});

export type ExtensionData = z.infer<typeof ExtensionDataSchema>;
