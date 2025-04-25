import type { ZodSchema } from "zod";

import type { ChangelogListing } from "@/services/cplx-api/types";

export class CplxApiOfflineService {
  static fetchChangelog({
    version: _,
  }: { version?: string } = {}): Promise<string> {
    return Promise.resolve("");
  }

  static fetchChangelogListing(): Promise<ChangelogListing> {
    return Promise.resolve({});
  }

  static async fetchRemoteResource<T>(_params: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T> {
    throw new Error("Not available in offline mode");
  }

  static async fetchVersionedRemoteResource<T>(_params: {
    resourcePath: string;
    zodSchema: ZodSchema<T>;
  }): Promise<T> {
    throw new Error("Not available in offline mode");
  }

  static async fetchSoftCacheBuster(): Promise<string> {
    throw new Error("Not available in offline mode");
  }
}
