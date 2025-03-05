import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { usePluginGuardsStore } from "@/components/plugins-guard/store";
import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useCreatePortalContainers } from "@/plugins/_core/ui-groups/thread-message-toolbar/useCreatePortalContainers";
import BetterMessageCopyButton from "@/plugins/thread-better-message-copy-buttons";
import hideNativeButtonsCss from "@/plugins/thread-better-message-copy-buttons/hide-native-buttons.css?inline";
import EditQueryButton from "@/plugins/thread-better-message-toolbars/edit-query-button";
import ThreadBetterRewriteDropdown from "@/plugins/thread-better-rewrite-dropdown";
import hideNativeRewriteDropdownsCss from "@/plugins/thread-better-rewrite-dropdown/hide-native-rewrite-dropdowns.css?inline";
import ThreadMessageTtsButton from "@/plugins/thread-message-tts";
import { PluginsStatesService } from "@/services/plugins-states";

export default function ThreadMessageToolbarExtraButtonsWrapper() {
  const portalContainers = useCreatePortalContainers();
  const pluginsEnableStates = PluginsStatesService.getEnableStatesCachedSync();

  const hasActiveSub = usePluginGuardsStore((store) => store.hasActiveSub);

  useInsertCss({
    id: "cplx-thread-message-toolbar-hide-native-copy-buttons",
    css: hideNativeButtonsCss,
    inject: pluginsEnableStates["thread:betterMessageCopyButtons"],
  });

  useInsertCss({
    id: "cplx-thread-message-toolbar-hide-native-rewrite-dropdowns",
    css: hideNativeRewriteDropdownsCss,
    inject:
      pluginsEnableStates["thread:betterRewriteDropdowns"] && hasActiveSub,
  });

  return portalContainers.map((portalContainer, index) => (
    <Portal key={index} container={portalContainer as HTMLElement}>
      <MemoizedWrapper messageBlockIndex={index} />
    </Portal>
  ));
}

const MemoizedWrapper = memo(function MemoizedWrapper({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  return (
    <div className="x-flex x-items-center x-gap-1">
      <CsUiPluginsGuard
        requiresLoggedIn
        dependentPluginIds={["thread:messageTts"]}
      >
        <ThreadMessageTtsButton messageBlockIndex={messageBlockIndex} />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        requiresLoggedIn
        allowedAccountTypes={[["pro"], ["pro", "enterprise"]]}
        dependentPluginIds={["thread:betterRewriteDropdowns"]}
      >
        <ThreadBetterRewriteDropdown messageBlockIndex={messageBlockIndex} />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        dependentPluginIds={["thread:betterMessageToolbars"]}
        additionalCheck={({ settings }) =>
          settings.plugins["thread:betterMessageToolbars"].editQueryButton
        }
      >
        <EditQueryButton messageBlockIndex={messageBlockIndex} />
      </CsUiPluginsGuard>
      <CsUiPluginsGuard
        dependentPluginIds={["thread:betterMessageCopyButtons"]}
      >
        <BetterMessageCopyButton messageBlockIndex={messageBlockIndex} />
      </CsUiPluginsGuard>
    </div>
  );
});
