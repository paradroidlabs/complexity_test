import { z } from "zod";

import { BetterCodeBlockFineGrainedOptionsSchema } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { PromptHistorySchema } from "@/data/plugins/prompt-history/prompt-history.type";
import { PinnedSpaceSchema } from "@/data/plugins/space-navigator/pinned-space.types";
import { ThemeSchema } from "@/data/plugins/themes/theme-registry.types";
import { ExtensionSettingsSchema } from "@/services/extension-settings/types";

export const ExtensionDataSchema = z.object({
  localStorage: z.object({
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
    pinnedSpaces: z.array(PinnedSpaceSchema),
  }),
});

export type ExtensionData = z.infer<typeof ExtensionDataSchema>;
