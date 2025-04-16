import type { ComponentType } from "react";

import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import type {
  GuardConditions,
  AdditionalCheckFn,
} from "@/plugins/_core/plugins-guard/guards";

type WithPluginsGuardOptions = GuardConditions & {
  additionalCheck?: AdditionalCheckFn;
  onNotSatisfiedAllConditions?: () => void;
  fallback?: React.ReactNode;
  customMessage?: string;
};

/**
 * Higher-Order Component that wraps a component with CsUiPluginsGuard
 * @param Component - The component to be wrapped
 * @param options - Guard conditions and additional options
 */
export function withPluginsGuard<P extends object>(
  Component: ComponentType<P>,
  options: WithPluginsGuardOptions,
) {
  const {
    dependentPluginIds,
    location,
    desktopOnly,
    mobileOnly,
    requiresLoggedIn,
    allowIncognito,
    allowedAccountTypes,
    browser,
    additionalCheck,
    onNotSatisfiedAllConditions,
    fallback,
    customMessage,
  } = options;

  const displayName = Component.displayName || Component.name || "Component";

  function WithPluginsGuard(props: P) {
    return (
      <CsUiPluginsGuard
        dependentPluginIds={dependentPluginIds}
        location={location}
        desktopOnly={desktopOnly}
        mobileOnly={mobileOnly}
        requiresLoggedIn={requiresLoggedIn}
        allowIncognito={allowIncognito}
        allowedAccountTypes={allowedAccountTypes}
        browser={browser}
        additionalCheck={additionalCheck}
        fallback={fallback}
        customMessage={customMessage}
        onNotSatisfiedAllConditions={onNotSatisfiedAllConditions}
      >
        <Component {...props} />
      </CsUiPluginsGuard>
    );
  }

  WithPluginsGuard.displayName = `withPluginsGuard(${displayName})`;

  return WithPluginsGuard;
}
