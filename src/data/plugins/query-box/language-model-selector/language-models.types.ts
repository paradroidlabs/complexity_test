import { z } from "zod";

import {
  autoLanguageModels,
  deepResearchLanguageModels,
  fastLanguageModels,
  languageModels,
  localLanguageModels,
  reasoningLanguageModels,
} from "@/data/plugins/query-box/language-model-selector/language-models";
import {
  ExtractCode,
  FilterModelByType,
} from "@/data/plugins/query-box/language-model-selector/utils.types";

export const LanguageModelSchema = z.object({
  label: z.string(),
  shortLabel: z.string(),
  code: z.string().transform((value) => value as LanguageModelCode),
  provider: z.string().transform((value) => value as LanguageModelProvider),
  type: z.enum(["auto", "fast", "reasoning", "deepResearch"]),
  limitKey: z.string().optional(),
  description: z.string().optional(),
  hideFromList: z.boolean().optional(),
});

export type LanguageModel = z.infer<typeof LanguageModelSchema>;

export type LanguageModelCode =
  | (typeof localLanguageModels)[number]["code"]
  | (string & Record<string, unknown>);

export type FastLanguageModelCode = ExtractCode<
  FilterModelByType<typeof localLanguageModels, "fast">
>;
export type ReasoningLanguageModelCode = ExtractCode<
  FilterModelByType<typeof localLanguageModels, "reasoning">
>;
export type DeepResearchLanguageModelCode = ExtractCode<
  FilterModelByType<typeof localLanguageModels, "deepResearch">
>;
export type AutoLanguageModelCode = ExtractCode<
  FilterModelByType<typeof localLanguageModels, "auto">
>;

export type LanguageModelProvider =
  | (typeof localLanguageModels)[number]["provider"]
  | (string & Record<string, unknown>);

export function isLanguageModelCode(
  value: string,
): value is LanguageModel["code"] {
  return languageModels.some((model) => model.code === value);
}

export function isReasoningLanguageModelCode(
  value: string,
): value is ReasoningLanguageModelCode {
  return reasoningLanguageModels.some((model) => model.code === value);
}

export function isFastLanguageModelCode(
  value: string,
): value is FastLanguageModelCode {
  return fastLanguageModels.some((model) => model.code === value);
}

export function isDeepResearchLanguageModelCode(
  value: string,
): value is DeepResearchLanguageModelCode {
  return deepResearchLanguageModels.some((model) => model.code === value);
}

export function isAutoLanguageModelCode(
  value: string,
): value is AutoLanguageModelCode {
  return autoLanguageModels.some((model) => model.code === value);
}
