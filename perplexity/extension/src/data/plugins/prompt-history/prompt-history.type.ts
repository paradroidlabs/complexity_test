import { z } from "zod";

export const PromptHistorySchema = z.object({
  id: z.string(),
  prompt: z.string(),
  createdAt: z.number(),
});

export type PromptHistory = z.infer<typeof PromptHistorySchema>;
