import { Suspense } from "react";

import { APP_CONFIG } from "@/app.config";
import CopyButton from "@/components/CopyButton";
import ErrorBoundary from "@/components/ErrorBoundary";
import {
  type GuardConditions,
  type AdditionalCheckParams,
  type AdditionalCheckFn,
  checkDeviceType,
  checkAuthStatus,
  checkAccountTypes,
  checkPluginDependencies,
  checkIncognito,
  checkLocation,
  checkBrowser,
} from "@/components/plugins-guard/guards";
import { usePluginGuardsStore } from "@/components/plugins-guard/store";
import {
  Dialog,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Ul } from "@/components/ui/typography";
import { PLUGINS_METADATA } from "@/data/plugins-data/plugins-data";
import usePplxIncognitoMode from "@/hooks/usePplxIncognitoMode";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { whereAmI } from "@/utils/utils";

type CsUiPluginsGuardProps = GuardConditions & {
  children: React.ReactNode;
  additionalCheck?: AdditionalCheckFn;
  onNotSatisfiedAllConditions?: () => void;
  fallback?: React.ReactNode;
  customMessage?: string;
};

function CsUiPluginsGuardError({
  dependentPluginIds,
  location,
  errorMessage,
  customMessage,
}: Omit<CsUiPluginsGuardProps, "children"> & { errorMessage?: string }) {
  const [open, setOpen] = useState(true);

  const traces = useErrorTraces({
    errorMessage,
    customMessage,
    location,
    dependentPluginIds,
  });
  const pluginsError = usePluginsError(dependentPluginIds);

  return (
    <Dialog
      defaultOpen
      closeOnInteractOutside={false}
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complexity encountered an error</DialogTitle>
          <DialogDescription>
            {dependentPluginIds?.length != null &&
              dependentPluginIds?.length > 0 &&
              pluginsError}
            {traces}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

function useGuardConditions(props: CsUiPluginsGuardProps) {
  const { currentLocation, hasActiveSub, isLoggedIn, isMobile, isOrgMember } =
    usePluginGuardsStore();

  const pluginsEnableStates = PluginsStatesService.getEnableStatesCachedSync();
  const isIncognito = usePplxIncognitoMode();

  const deviceValid = checkDeviceType(props, { isMobile });
  const authValid = checkAuthStatus(props, { isLoggedIn });
  const accountValid = checkAccountTypes(props, { hasActiveSub, isOrgMember });
  const dependenciesValid = checkPluginDependencies(props, {
    pluginsEnableStates,
  });
  const locationValid = checkLocation(props, {
    currentLocation,
  });
  const incognitoValid = checkIncognito(props, { isIncognito });
  const browserValid = checkBrowser(props);

  return {
    deviceValid,
    authValid,
    accountValid,
    dependenciesValid,
    locationValid,
    incognitoValid,
    browserValid,
    pluginsEnableStates,
  };
}

export default function CsUiPluginsGuard(props: CsUiPluginsGuardProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [key, setKey] = useState(0); // Used to force re-render
  const errorRef = useRef<Error | null>(null);

  useEffect(() => {
    setRetryCount(0);
    setError(null);
    setKey(0);
    errorRef.current = null;
  }, [props.children]);

  useEffect(() => {
    if (errorRef.current && retryCount < 3) {
      const currentError = errorRef.current;

      if (
        currentError.message.includes(
          "Failed to fetch dynamically imported module",
        ) &&
        chrome.runtime.id == null
      ) {
        return;
      }

      console.error(
        `[CPLX] Plugin error, retry attempt ${retryCount + 1}/3: ${currentError.message}`,
      );

      setKey((prevKey) => prevKey + 1);

      errorRef.current = null;
    }
  }, [retryCount]);

  const {
    deviceValid,
    authValid,
    accountValid,
    dependenciesValid,
    locationValid,
    incognitoValid,
    browserValid,
    pluginsEnableStates,
  } = useGuardConditions(props);

  const settings = ExtensionLocalStorageService.getCachedSync();
  const additionalCheckParams: AdditionalCheckParams = {
    ...props,
    pluginsEnableStates,
    settings,
  };
  const additionalCheckValid =
    props.additionalCheck?.(additionalCheckParams) ?? true;

  const allConditionsMet = [
    deviceValid,
    authValid,
    accountValid,
    dependenciesValid,
    locationValid,
    incognitoValid,
    browserValid,
    additionalCheckValid,
  ].every(Boolean);

  if (!allConditionsMet) {
    props.onNotSatisfiedAllConditions?.();
    return props.fallback;
  }

  if (error && retryCount >= 3) {
    return <CsUiPluginsGuardError {...props} errorMessage={error.message} />;
  }

  return (
    <ErrorBoundary
      key={key}
      fallback={({ error: boundaryError }: { error: Error }) => {
        if (
          boundaryError.message.includes(
            "Failed to fetch dynamically imported module",
          ) &&
          chrome.runtime.id == null
        ) {
          return null;
        }

        if (!errorRef.current) {
          errorRef.current = boundaryError;

          if (retryCount < 3) {
            setRetryCount((prevCount) => prevCount + 1);
          } else {
            setError(boundaryError);
          }
        }

        if (retryCount >= 3) {
          return (
            <CsUiPluginsGuardError
              {...props}
              errorMessage={boundaryError.message}
            />
          );
        }

        return null;
      }}
    >
      <Suspense fallback={null}>{props.children}</Suspense>
    </ErrorBoundary>
  );
}

function useErrorTraces({
  errorMessage,
  customMessage,
  location,
  dependentPluginIds,
}: {
  errorMessage?: string;
  customMessage?: string;
  location?: ReturnType<typeof whereAmI>[];
  dependentPluginIds?: GuardConditions["dependentPluginIds"];
}) {
  const tracesAsString = JSON.stringify(
    {
      errorMessage,
      customMessage,
      browser: APP_CONFIG.BROWSER,
      version: APP_CONFIG.VERSION,
      location,
      dependentPluginIds,
      currentUrl: window.location.href,
      settings: ExtensionLocalStorageService.getCachedSync(),
      pluginsStates: PluginsStatesService.getEnableStatesCachedSync(),
    },
    null,
    4,
  );

  return (
    <div className="x:flex x:flex-col">
      <div>Debugging information:</div>
      <div className="x:relative x:my-4 x:max-h-[300px] x:overflow-auto x:rounded-md x:bg-secondary x:p-2 x:font-mono">
        <CopyButton
          className="x:sticky x:top-2 x:right-2 x:float-right"
          content={tracesAsString}
        />
        <DebugInfoList traces={JSON.parse(tracesAsString)} />
      </div>
    </div>
  );
}

function usePluginsError(
  dependentPluginIds?: GuardConditions["dependentPluginIds"],
) {
  return dependentPluginIds?.length != null ? (
    <div>
      <div className="x:mt-2 x:text-sm x:text-muted-foreground">
        Disable these plugins if errors persist.
      </div>
      <Ul>
        {dependentPluginIds.map((pluginId) => (
          <li key={pluginId} className="x:text-foreground">
            {PLUGINS_METADATA[pluginId]?.title || pluginId}
          </li>
        ))}
      </Ul>
    </div>
  ) : null;
}

function DebugInfoList({ traces }: { traces: Record<string, unknown> }) {
  return (
    <Ul>
      {Object.entries(traces).map(([key, value]) => (
        <li key={key}>
          {key}: {typeof value === "string" ? value : JSON.stringify(value)}
        </li>
      ))}
    </Ul>
  );
}
