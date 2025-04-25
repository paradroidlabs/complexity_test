import semver from "semver";
import { z } from "zod";

import { APP_CONFIG } from "@/app.config";
import type { PluginId } from "@/data/plugin-registry/types";

export const remoteResourceTypes = ["css", "txt", "json"] as const;

export type RemoteResourceType = (typeof remoteResourceTypes)[number];

export const SemverSchema = z
  .string()
  .refine((v) => !!semver.valid(semver.coerce(v)), {
    message: "Invalid semver",
  })
  .transform((v) => semver.coerce(v)!.toString());

export const CplxVersionsApiResponseSchema = z.object({
  latest: SemverSchema,
  latestFirefox: SemverSchema,
  changelogEntries: z.array(SemverSchema),
  canvasInstructionLastUpdated: z.number().optional(),
});

export type CplxVersionsApiResponse = z.infer<
  typeof CplxVersionsApiResponseSchema
>;

export const CplxVersionsSchema = CplxVersionsApiResponseSchema.transform(
  (data) => {
    const latest = APP_CONFIG.BROWSER === "chrome" ? "latest" : "latestFirefox";

    return {
      latest: data[latest],
      canvasInstructionLastUpdated: data.canvasInstructionLastUpdated,
      changelogEntries: data.changelogEntries,
    };
  },
);

export type CplxVersions = z.infer<typeof CplxVersionsSchema>;

export const FeatureCompatibilitySchema = z.record(
  z.string() as z.ZodType<PluginId>,
  SemverSchema,
);

export type FeatureCompatibility = z.infer<typeof FeatureCompatibilitySchema>;

export const ChangelogListingSchema = z.record(SemverSchema, z.string());

export type ChangelogListing = z.infer<typeof ChangelogListingSchema>;
