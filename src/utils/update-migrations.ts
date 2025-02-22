import { produce } from "immer";

import { APP_CONFIG } from "@/app.config";
import { ExtensionLocalStorage } from "@/services/extension-local-storage/extension-local-storage.types";
import { errorWrapper } from "@/utils/error-wrapper";
import { ExtensionVersion } from "@/utils/ext-version";

type MigrationFn = ({
  oldRawSettings,
}: {
  oldRawSettings: ExtensionLocalStorage;
}) => Promise<ExtensionLocalStorage>;

export const enableThreadMessageTtsKey: MigrationFn = async ({
  oldRawSettings,
}) => {
  console.log("[ExtUpdateMigrations] Enable Thread Message TTS Key");

  return produce(oldRawSettings, (draft) => {
    draft.plugins["thread:messageTts"] = {
      enabled: true,
      voice: "Mike",
    };
  });
};

export const migrateHideHomepageWidgetsKey: MigrationFn = async ({
  oldRawSettings,
}) => {
  console.log("[ExtUpdateMigrations] Migrate Hide HomepageWidgets Key");

  return produce(oldRawSettings, (draft) => {
    draft.plugins["home:hideHomepageWidgets"] = {
      enabled: (oldRawSettings.plugins["zenMode"] as any)
        .alwaysHideHomepageWidgets,
    };
  });
};

export const migrateInstantRewriteButtonKey: MigrationFn = async ({
  oldRawSettings,
}) => {
  console.log("[ExtUpdateMigrations] Migrate Instant Rewrite Button key");

  return produce(oldRawSettings, (draft) => {
    draft.plugins["thread:instantRewriteButton"] = {
      enabled: (oldRawSettings.plugins["thread:betterMessageToolbars"] as any)
        .instantRewriteButton,
    };
  });
};

export const migrateShowPostUpdateReleaseNotesPopupKey: MigrationFn = async ({
  oldRawSettings,
}) => {
  console.log(
    "[ExtUpdateMigrations] Disabling post update release notes popup",
  );

  return produce(oldRawSettings, (draft) => {
    draft.showPostUpdateReleaseNotesPopup = false;
  });
};

export const migrateSlashCommandMenuKey: MigrationFn = async ({
  oldRawSettings,
}) => {
  console.log("[ExtUpdateMigrations] Migrating slash command menu key");

  return produce(oldRawSettings, (draft) => {
    const isPromptHistoryEnabled =
      oldRawSettings.plugins["queryBox:slashCommandMenu:promptHistory"].enabled;

    draft.plugins["queryBox:slashCommandMenu"] = {
      enabled: isPromptHistoryEnabled,
      showTriggerButton: (
        oldRawSettings.plugins["queryBox:slashCommandMenu:promptHistory"] as any
      ).showTriggerButton,
    };
  });
};

export const migrateSpaceNavigatorKey: MigrationFn = async ({
  oldRawSettings,
}) => {
  console.log("[ExtUpdateMigrations] Migrating space navigator key");

  return produce(oldRawSettings, (draft) => {
    draft.plugins.spaceNavigator = (oldRawSettings.plugins as any)[
      "queryBox:spaceNavigator"
    ];
    delete (draft.plugins as any)["queryBox:spaceNavigator"];
  });
};

export const migrateThemePreloaderKey: MigrationFn = async ({
  oldRawSettings,
}) => {
  console.log("[ExtUpdateMigrations] Theme preloader migration");

  const hasPermissions = await chrome.permissions.contains({
    permissions: ["scripting", "webNavigation"],
  });

  if (!hasPermissions) return oldRawSettings;

  return produce(oldRawSettings, (draft) => {
    draft.preloadTheme = true;
  });
};

export const EXT_UPDATE_MIGRATIONS: Record<string, MigrationFn[]> = {
  "1.0.2.0": [migrateThemePreloaderKey],
  "1.3.2.0": [migrateSpaceNavigatorKey],
  "1.3.3.0": [migrateSlashCommandMenuKey],
  "1.3.5.0": [migrateShowPostUpdateReleaseNotesPopupKey],
  "1.4.2.0": [migrateInstantRewriteButtonKey, migrateHideHomepageWidgetsKey],
  "1.6.8.0": [enableThreadMessageTtsKey],
};

export async function migrateSchemas({
  previousVersion,
  rawSettings,
}: {
  previousVersion: string;
  rawSettings: ExtensionLocalStorage;
}) {
  if (!previousVersion) return rawSettings;

  console.log("Migrate schema from", previousVersion, "to", APP_CONFIG.VERSION);

  const migrations = Object.entries(EXT_UPDATE_MIGRATIONS);

  let migratedSettings: ExtensionLocalStorage = rawSettings;

  for (const [version, migrationFns] of migrations) {
    if (new ExtensionVersion(version).isNewerThan(previousVersion)) {
      for (const migrationFn of migrationFns) {
        const [newSettings, error] = await errorWrapper(
          (): Promise<ExtensionLocalStorage> =>
            migrationFn({ oldRawSettings: migratedSettings }),
        )();

        if (error || !newSettings) continue;

        migratedSettings = newSettings;
      }
    }
  }

  return migratedSettings;
}
