import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { lazily } from "react-lazily";

import { Toaster } from "@/components/Toaster";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import { QueryBoxComponents } from "@/plugins/_core/ui/groups/query-box/Wrapper";
import SidebarComponents from "@/plugins/_core/ui/groups/Sidebar";
import HomepageComponents from "@/plugins/_core/ui/route-groups/Home";
import SettingsComponents from "@/plugins/_core/ui/route-groups/Settings";
import SpacesPageComponents from "@/plugins/_core/ui/route-groups/SpacesPage";
import ThreadComponents from "@/plugins/_core/ui/route-groups/Thread";
import BetterSidebarWrapper from "@/plugins/better-sidebar/Wrapper";
import CloudflareTimeoutActionDialogWrapper from "@/plugins/cloudflare-timeout-auto-reload/Wrapper";
import CommandMenuWrapper from "@/plugins/command-menu/Wrapper";
import { SlashCommandMenu } from "@/plugins/slash-command/SlashCommandMenu";

const { ExtensionContextInvalidationWatchdog } = lazily(
  () => import("@/components/ExtensionContextInvalidationWatchdog"),
);
const { PostUpdateReleaseNotesDialog } = lazily(
  () => import("@/components/PostUpdateReleaseNotesDialog"),
);

export default function CsUiRoot() {
  return (
    <>
      <BetterSidebarWrapper />

      <HomepageComponents />

      <ThreadComponents />

      <SidebarComponents />

      <SpacesPageComponents />

      <SettingsComponents />

      <QueryBoxComponents />

      <CommandMenuWrapper />

      <SlashCommandMenu />

      <CloudflareTimeoutActionDialogWrapper />

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

      <Toaster
        viewportProps={{
          className:
            "x:top-0 x:md:[:where(body:is([location=thread],[location=collection])_*)]:top-[var(--header-height,70px)]",
        }}
      />

      <ReactQueryDevtools />
    </>
  );
}
