import { declarativeNetRequestListener } from "@/entrypoints/background/declarative-net-request";
import { contentScriptListeners } from "@/entrypoints/background/listeners/content-script";
import { createDashboardShortcut } from "@/entrypoints/background/listeners/dashboard-shortcut";
import { extensionIconActionListener } from "@/entrypoints/background/listeners/extension-icon-action";
import { onboardingFlowTrigger } from "@/entrypoints/background/listeners/onboarding-flow-trigger";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "bg:getTabId": () => number;
    "bg:openDirectReleaseNotes": ({ version }: { version: string }) => void;
    "bg:openOptionsPage": () => void;
  }
}

export function setupBackgroundListeners() {
  extensionIconActionListener();
  onboardingFlowTrigger();
  createDashboardShortcut();
  contentScriptListeners();
  declarativeNetRequestListener();

  const entries = import.meta.glob("@/**/*.background-listener.ts", {
    eager: true,
  }) as Record<string, { default: () => void }>;

  for (const [path, module] of Object.entries(entries)) {
    const listener = module.default;

    if (typeof listener !== "function") {
      throw new Error(`listener is not a function in ${path}`);
    }

    listener();
  }
}
