import { APP_CONFIG } from "@/app.config";
import type { PluginId } from "@/data/plugin-registry/types";
import type { ExtensionSettings } from "@/services/extension-settings/types";
import type { whereAmI } from "@/utils/utils";

export type GuardConditions = {
  dependentPluginIds?: PluginId[];
  location?: ReturnType<typeof whereAmI>[];
  desktopOnly?: boolean;
  mobileOnly?: boolean;
  requiresLoggedIn?: boolean;
  allowIncognito?: boolean;
  allowedAccountTypes?: ("free" | "pro" | "enterprise")[][];
  browser?: ("chrome" | "firefox")[];
};

export type GuardCheckParams = {
  isMobile: boolean;
  isLoggedIn: boolean;
  isOrgMember: boolean;
  hasActiveSub: boolean;
  currentLocation: ReturnType<typeof whereAmI>;
  isIncognito: boolean;
  pluginsStates: Record<PluginId, boolean>;
};

export function checkDeviceType(
  { desktopOnly, mobileOnly }: GuardConditions,
  { isMobile }: Pick<GuardCheckParams, "isMobile">,
): boolean {
  if (desktopOnly && isMobile) return false;
  if (mobileOnly && !isMobile) return false;
  return true;
}

export function checkAuthStatus(
  { requiresLoggedIn }: GuardConditions,
  { isLoggedIn }: Pick<GuardCheckParams, "isLoggedIn">,
): boolean {
  if (requiresLoggedIn && !isLoggedIn) return false;
  return true;
}

export function checkAccountTypes(
  { allowedAccountTypes }: GuardConditions,
  params: Pick<GuardCheckParams, "hasActiveSub" | "isOrgMember">,
): boolean {
  if (!allowedAccountTypes || !allowedAccountTypes?.length) return true;

  const accountStatus: ("free" | "pro" | "enterprise")[] = [];

  if (params.isOrgMember) accountStatus.push("enterprise");

  accountStatus.push(params.hasActiveSub ? "pro" : "free");

  return allowedAccountTypes.some((accountType) => {
    const sameLength = accountType.length === accountStatus.length;
    const sameStatus = accountType.every((status) =>
      accountStatus.includes(status),
    );

    return sameLength && sameStatus;
  });
}

export function checkPluginDependencies(
  { dependentPluginIds }: GuardConditions,
  { pluginsStates }: Pick<GuardCheckParams, "pluginsStates">,
): boolean {
  if (!dependentPluginIds || !dependentPluginIds?.length) return true;

  return dependentPluginIds.every((pluginId) => pluginsStates[pluginId]);
}

export function checkLocation(
  { location }: GuardConditions,
  { currentLocation }: Pick<GuardCheckParams, "currentLocation">,
): boolean {
  if (!location || !location?.length) return true;
  if (currentLocation === undefined) return false;

  return location.some((loc) => loc === currentLocation);
}

export function checkIncognito(
  { allowIncognito }: GuardConditions,
  { isIncognito }: Pick<GuardCheckParams, "isIncognito">,
): boolean {
  if (allowIncognito === false && isIncognito) return false;
  return true;
}

export function checkBrowser({ browser }: GuardConditions): boolean {
  if (!browser || !browser?.length) return true;
  return browser.includes(APP_CONFIG.BROWSER);
}

export type AdditionalCheckParams = GuardConditions & {
  pluginsStates: Record<PluginId, boolean>;
  settings: ExtensionSettings;
};

export type AdditionalCheckFn = (props: AdditionalCheckParams) => boolean;
