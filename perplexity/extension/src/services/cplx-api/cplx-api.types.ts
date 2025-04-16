import { z } from "zod";

import type { PluginId } from "@/data/plugin-registry/types";

export const CplxVersionsApiResponseSchema = z.object({
  latest: z.string(),
  latestFirefox: z.string(),
  changelogEntries: z.array(z.string()),
  canvasInstructionLastUpdated: z.number().optional(),
});

export type CplxVersionsApiResponse = z.infer<
  typeof CplxVersionsApiResponseSchema
>;

export type CplxVersions = Omit<CplxVersionsApiResponse, "latestFirefox">;

export const FeatureCompatibilitySchema = z.record(
  z.string() as z.ZodType<PluginId>,
  z.string(),
);

export type FeatureCompatibility = z.infer<typeof FeatureCompatibilitySchema>;
