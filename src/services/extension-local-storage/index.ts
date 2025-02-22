import { produce } from "immer";
import { ZodIssue } from "zod";

import { APP_CONFIG } from "@/app.config";
import { ExtensionLocalStorageApi } from "@/services/extension-local-storage/extension-local-storage-api";
import {
  ExtensionLocalStorageSchema,
  ExtensionLocalStorage,
} from "@/services/extension-local-storage/extension-local-storage.types";
import {
  extensionLocalStorageQueries,
  invalidateExtensionLocalStorageDataQuery,
} from "@/services/extension-local-storage/query-keys";
import { DEFAULT_STORAGE } from "@/services/extension-local-storage/storage-defaults";
import {
  mergeUndefined,
  setPathToUndefined,
} from "@/services/extension-local-storage/utils";
import { isZodError } from "@/types/utils.types";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { queryClient } from "@/utils/ts-query-client";
import { migrateSchemas } from "@/utils/update-migrations";
import { isInContentScript } from "@/utils/utils";

export class ExtensionLocalStorageService {
  public static async get(): Promise<ExtensionLocalStorage> {
    const settings = await queryClient.fetchQuery({
      ...extensionLocalStorageQueries.data,
      gcTime: isInContentScript() ? Infinity : undefined,
    });

    return settings;
  }

  public static getCachedSync(): ExtensionLocalStorage {
    const settings = ExtensionLocalStorageService.safeGetCachedSync();

    if (!settings) {
      throw new Error("Extension local storage is not initialized");
    }

    return settings;
  }

  public static safeGetCachedSync(): ExtensionLocalStorage | null {
    return (
      queryClient.getQueryData<ExtensionLocalStorage>(
        extensionLocalStorageQueries.data.queryKey,
      ) ?? null
    );
  }

  public static async set(
    updater: (draft: ExtensionLocalStorage) => void,
  ): Promise<ExtensionLocalStorage> {
    const isContentScript = isInContentScript();

    const currentSettings = isContentScript
      ? await ExtensionLocalStorageService.get()
      : (ExtensionLocalStorageService.getCachedSync() ??
        (await ExtensionLocalStorageService.get()));

    const newSettings = produce(currentSettings, (draft) => {
      updater(draft);
    });

    await ExtensionLocalStorageApi.set(newSettings);

    invalidateExtensionLocalStorageDataQuery();

    return newSettings;
  }

  public static async exportAll(): Promise<ExtensionLocalStorage> {
    const settings = await ExtensionLocalStorageService.get();
    return settings;
  }

  public static async import(data: ExtensionLocalStorage): Promise<void> {
    await ExtensionLocalStorageApi.set(
      await processData(data, await ExtensionLocalStorageService.get()),
    );
  }

  public static async clearAll(): Promise<void> {
    await ExtensionLocalStorageApi.set(DEFAULT_STORAGE);
  }
}

async function processData(
  rawSettings: unknown,
  defaultSettings: ExtensionLocalStorage,
): Promise<ExtensionLocalStorage> {
  const result = await sanitizeData(rawSettings, defaultSettings);

  let sanitizedSettings = result.sanitizedSettings;
  const issues = result.issues;

  if (!issues.length) {
    return sanitizedSettings;
  }

  if (
    rawSettings != null &&
    typeof rawSettings === "object" &&
    "schemaVersion" in rawSettings &&
    issues.some((issue) => issue.path[0] === "schemaVersion")
  ) {
    sanitizedSettings = await migrateSchemas({
      previousVersion: rawSettings.schemaVersion as string,
      rawSettings: sanitizedSettings,
    });

    sanitizedSettings = (await sanitizeData(sanitizedSettings, defaultSettings))
      .sanitizedSettings;
  }

  await ExtensionLocalStorageApi.set(sanitizedSettings);
  return sanitizedSettings;
}

async function sanitizeData(
  rawSettings: unknown,
  defaultSettings: ExtensionLocalStorage,
): Promise<{
  sanitizedSettings: ExtensionLocalStorage;
  issues: ZodIssue[];
}> {
  const { error, data } = ExtensionLocalStorageSchema.safeParse(rawSettings);

  if (!error) {
    return {
      sanitizedSettings: data,
      issues: [],
    };
  }

  if (!isZodError(error)) {
    return {
      sanitizedSettings: DEFAULT_STORAGE,
      issues: [],
    };
  }

  console.log("[Cplx] Settings schema mismatch", error.issues);

  let sanitizedSettings = error.issues.reduce(
    (settings, issue) =>
      setPathToUndefined({
        paths: issue.path as string[],
        obj: settings,
      }) as ExtensionLocalStorage,
    rawSettings as ExtensionLocalStorage,
  );

  sanitizedSettings = {
    ...mergeUndefined({
      target: sanitizedSettings,
      source: defaultSettings,
    }),
    schemaVersion: APP_CONFIG.VERSION,
  };

  return {
    sanitizedSettings,
    issues: error.issues,
  };
}

export async function fetchExtensionLocalStorageData(): Promise<ExtensionLocalStorage> {
  return processData(await ExtensionLocalStorageApi.get(), DEFAULT_STORAGE);
}

csLoaderRegistry.register({
  id: "cache:extensionLocalStorage",
  loader: async () => {
    await ExtensionLocalStorageService.get();
  },
});
