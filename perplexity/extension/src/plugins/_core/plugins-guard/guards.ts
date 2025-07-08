import { APP_CONFIG } from "@/app.config";
import type { PluginId } from "@/data/plugin-registry/types";
import type { ExtensionSettings } from "@/services/extension-settings/types";
import type { PluginsStates } from "@/services/plugins-states/types";
import type { whereAmI } from "@/utils/utils";

const PPLX_SUB_TIER_ENUM = {
  pro: 1,
  max: 2,
} as const;

export type PplxSubTier = keyof typeof PPLX_SUB_TIER_ENUM;

export type GuardConditions = {
  dependentPluginIds?: PluginId[];
  location?: ReturnType<typeof whereAmI>[];
  desktopOnly?: boolean;
  mobileOnly?: boolean;
  requiresLoggedIn?: boolean;
  allowIncognito?: boolean;
  mustHaveActiveSub?: boolean;
  leastTier?: PplxSubTier;
  browser?: ("chrome" | "firefox")[];
  requiredPermissions?: chrome.runtime.ManifestPermissions[];
};

export type GuardCheckParams = {
  isMobile: boolean;
  isLoggedIn: boolean;
  isOrgMember: boolean;
  hasActiveSub: boolean;
  subTier: PplxSubTier | null;
  currentLocation: ReturnType<typeof whereAmI>;
  isIncognito: boolean;
  pluginsStates: PluginsStates;
  grantedPermissions: chrome.runtime.ManifestPermissions[];
};

export function checkRequiredPermissions(
  { requiredPermissions }: GuardConditions,
  { grantedPermissions }: Pick<GuardCheckParams, "grantedPermissions">,
): boolean {
  if (!requiredPermissions || !requiredPermissions?.length) return true;
  return requiredPermissions.every((permission) =>
    grantedPermissions.includes(permission),
  );
}

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

export function checkPplxSubStatus(
  { mustHaveActiveSub, leastTier }: GuardConditions,
  {
    isLoggedIn,
    hasActiveSub,
    subTier,
  }: Pick<
    GuardCheckParams,
    "hasActiveSub" | "isOrgMember" | "isLoggedIn" | "subTier"
  >,
): boolean {
  if (!mustHaveActiveSub) return true;

  if (!isLoggedIn || !hasActiveSub) return false;

  if (leastTier && subTier) {
    if (PPLX_SUB_TIER_ENUM[subTier] < PPLX_SUB_TIER_ENUM[leastTier])
      return false;
  }

  return true;
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
  pluginsStates: PluginsStates;
  settings: ExtensionSettings;
};

export type AdditionalCheckFn = (props: AdditionalCheckParams) => boolean;
