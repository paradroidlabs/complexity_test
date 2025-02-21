import { produce } from "immer";

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
import { errorWrapper } from "@/utils/error-wrapper";
import { ExtensionVersion } from "@/utils/ext-version";
import { queryClient } from "@/utils/ts-query-client";
import { EXT_UPDATE_MIGRATIONS } from "@/utils/update-migrations";
import { isInContentScript, whereAmI } from "@/utils/utils";
import packageJson from "~/package.json";

export class ExtensionLocalStorageService {
  public static initializeReactiveStore(): boolean {
    if (whereAmI() !== "unknown") {
      throw new Error(
        "Extension local storage can not be reactive in content scripts!",
      );
    }

    ExtensionLocalStorageApi.listen(() => {
      invalidateExtensionLocalStorageDataQuery();
    });

    return true;
  }

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
      : (ExtensionLocalStorageService.safeGetCachedSync() ??
        (await ExtensionLocalStorageService.get()));

    const newSettings = produce(currentSettings, (draft) => {
      updater(draft);
    });

    await ExtensionLocalStorageApi.set(newSettings);

    // dont need to invalidate the query cache here because we've already listening to changes in initializeReactiveStore()

    return newSettings;
  }

  public static async exportAll(): Promise<ExtensionLocalStorage> {
    const settings = await ExtensionLocalStorageService.get();
    return settings;
  }

  public static async import(data: ExtensionLocalStorage): Promise<void> {
    await ExtensionLocalStorageApi.set(
      await mergeData(data, await ExtensionLocalStorageService.get()),
    );
  }

  public static async clearAll(): Promise<void> {
    await ExtensionLocalStorageApi.set(DEFAULT_STORAGE);
  }
}

async function parseStoreData(
  rawSettings: ExtensionLocalStorage,
): Promise<ExtensionLocalStorage> {
  return mergeData(rawSettings, DEFAULT_STORAGE);
}

async function mergeData(
  rawSettings: ExtensionLocalStorage,
  defaultSettings: ExtensionLocalStorage,
): Promise<ExtensionLocalStorage> {
  const { error } = ExtensionLocalStorageSchema.safeParse(rawSettings);

  if (!error) {
    return rawSettings;
  }

  if (!isZodError(error)) {
    return DEFAULT_STORAGE;
  }

  console.log("[Cplx] Settings schema mismatch");

  if (error.issues.some((issue) => issue.path[0] === "schemaVersion")) {
    return mergeData(
      (await updateMigrations({
        previousVersion: rawSettings.schemaVersion,
        rawSettings,
      })) ?? rawSettings,
      DEFAULT_STORAGE,
    );
  }

  const cleanSettings = error.issues.reduce((settings, issue) => {
    return setPathToUndefined({
      paths: issue.path as string[],
      obj: settings,
    }) as ExtensionLocalStorage;
  }, rawSettings);

  const updatedSettings = {
    ...mergeUndefined({
      target: cleanSettings,
      source: defaultSettings,
    }),
    schemaVersion: packageJson.version,
  };

  ExtensionLocalStorageSchema.parse(updatedSettings);

  await ExtensionLocalStorageApi.set(updatedSettings);

  return updatedSettings;
}

export async function fetchExtensionLocalStorageData(): Promise<ExtensionLocalStorage> {
  return parseStoreData(await ExtensionLocalStorageApi.get());
}

csLoaderRegistry.register({
  id: "cache:extensionLocalStorage",
  loader: async () => {
    await ExtensionLocalStorageService.get();
  },
});

async function updateMigrations({
  previousVersion,
  rawSettings,
}: {
  previousVersion: string;
  rawSettings: ExtensionLocalStorage;
}) {
  if (!previousVersion) return;

  console.log("Migrate schema from", previousVersion, "to", APP_CONFIG.VERSION);

  const migrations = Object.entries(EXT_UPDATE_MIGRATIONS);

  let migratedSettings: ExtensionLocalStorage = rawSettings;

  for (const [version, migrationFns] of migrations) {
    if (new ExtensionVersion(version).isNewerThan(previousVersion)) {
      for (const migrationFn of migrationFns) {
        const oldRawSettings = migratedSettings ?? rawSettings;
        const [newSettings, error] = await errorWrapper(
          (): Promise<ExtensionLocalStorage> => migrationFn({ oldRawSettings }),
        )();

        if (error || !newSettings) continue;

        migratedSettings = newSettings;
      }
    }
  }

  return {
    ...migratedSettings,
    schemaVersion: packageJson.version,
  };
}
