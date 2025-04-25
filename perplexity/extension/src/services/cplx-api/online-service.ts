import type { ZodSchema } from "zod";

import { APP_CONFIG } from "@/app.config";
import {
  ChangelogListingSchema,
  type ChangelogListing,
} from "@/services/cplx-api/types";
import { fetchResourceWithSchema, getUrl } from "@/services/cplx-api/utils";
import { fetchTextResource } from "@/utils/utils";
export class CplxApiService {
  static async fetchChangelog({ version }: { version?: string } = {}) {
    const targetVersion = version ?? APP_CONFIG.VERSION;

    const resp = await fetch(
      getUrl({
        path: `/changelogs/${targetVersion}.md`,
        passiveCacheBusterInterval: 1000 * 60 * 30,
      }).toString(),
    );

    if (resp.status === 404) {
      throw new Error(
        `Failed to fetch changelog for version ${targetVersion}.`,
      );
    }

    return resp.text();
  }

  static async fetchChangelogListing(): Promise<ChangelogListing> {
    return ChangelogListingSchema.parse(
      JSON.parse(
        await fetchTextResource(
          getUrl({
            path: "/changelogs/listing.json",
          }).toString(),
        ),
      ),
    );
  }

  static async fetchRemoteResource<T>({
    resourcePath,
    zodSchema,
  }: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T> {
    return fetchResourceWithSchema({
      resourcePath,
      zodSchema,
      pathPrefix: "/resources",
    });
  }

  static async fetchVersionedRemoteResource<T>({
    resourcePath,
    zodSchema,
  }: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T> {
    return fetchResourceWithSchema({
      resourcePath,
      zodSchema,
      pathPrefix: "/versioned-resources",
    });
  }

  static async fetchSoftCacheBuster() {
    return fetchTextResource(
      getUrl({
        path: "/cache-buster",
        passiveCacheBusterInterval: 0,
      }).toString(),
    );
  }
}
