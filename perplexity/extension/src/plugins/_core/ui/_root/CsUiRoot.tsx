// --- [DO NOT REMOVE] ---
// CRXJS treats statically imported css differently on dev build vs production build
// must keep this for tailwind to generate and hmr arbitrary classes in dev mode (this will be removed when building for prod)
import "@/assets/index.css";
import "@/assets/cs.css";
// --- [DO NOT REMOVE] ---

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazily } from "react-lazily";

import { Toaster } from "@/components/Toaster";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import { QueryBoxComponents } from "@/plugins/_core/ui/groups/query-box/Wrapper";
import SidebarComponents from "@/plugins/_core/ui/groups/Sidebar";
import HomepageComponents from "@/plugins/_core/ui/route-groups/Home";
import SettingsComponents from "@/plugins/_core/ui/route-groups/Settings";
import SpacePageComponents from "@/plugins/_core/ui/route-groups/SpacePage";
import ThreadComponents from "@/plugins/_core/ui/route-groups/Thread";
import CommandMenuWrapper from "@/plugins/command-menu/Wrapper";
import OnCloudflareTimeoutWrapper from "@/plugins/on-cf-timeout-auto-reload/Wrapper";

const { ExtensionContextInvalidationWatchdog } = lazily(
  () => import("@/components/ExtensionContextInvalidationWatchdog"),
);
const { PostUpdateReleaseNotesDialog } = lazily(
  () => import("@/components/PostUpdateReleaseNotesDialog"),
);

export default function CsUiRoot() {
  return (
    <>
      <HomepageComponents />

      <ThreadComponents />

      <SidebarComponents />

      <SpacePageComponents />

      <SettingsComponents />

      <QueryBoxComponents />

      <CommandMenuWrapper />

      <OnCloudflareTimeoutWrapper />

      <CsUiPluginsGuard
        desktopOnly
        additionalCheck={({ settings }) =>
          settings.showPostUpdateReleaseNotesPopup &&
          !settings.isPostUpdateReleaseNotesPopupDismissed
        }
      >
        <PostUpdateReleaseNotesDialog />
      </CsUiPluginsGuard>

      <CsUiPluginsGuard browser={["chrome"]}>
        <ExtensionContextInvalidationWatchdog />
      </CsUiPluginsGuard>

      <Toaster />

      <ReactQueryDevtools />
    </>
  );
}

export const csUiRootCss =
  (await import("@/assets/index.css?inline")).default +
  (await import("@/assets/cs.css?inline")).default;
