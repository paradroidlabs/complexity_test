import { z } from "zod";

import { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";

export const PplxCookieSearchModelsSchema = z.object({
  reasoning: z
    .string()
    .transform((val) => val as LanguageModel["code"])
    .optional(),
  pro: z
    .string()
    .transform((val) => val as LanguageModel["code"])
    .optional(),
  deepResearch: z
    .string()
    .transform((val) => val as LanguageModel["code"])
    .optional(),
});

export type PplxCookieSearchModels = z.infer<
  typeof PplxCookieSearchModelsSchema
>;

export type PplxCookieSearchModes =
  | "auto"
  | "pro"
  | "reasoning"
  | "deepResearch";
