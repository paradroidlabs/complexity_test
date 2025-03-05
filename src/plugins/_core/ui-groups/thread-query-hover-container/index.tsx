import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { Portal } from "@/components/ui/portal";
import { useCreatePortalContainers } from "@/plugins/_core/ui-groups/thread-query-hover-container/useCreatePortalContainers";
import QueryWordsAndCharactersCount from "@/plugins/thread-better-message-toolbars/query-words-and-characters-count";

export default function ThreadQueryHoverContainerExtraButtonsWrapper() {
  const portalContainers = useCreatePortalContainers();

  return portalContainers.map((portalContainer, index) => (
    <Portal key={index} container={portalContainer as HTMLElement}>
      <div className="x-flex x-h-full x-items-center">
        <CsUiPluginsGuard
          dependentPluginIds={["thread:betterMessageToolbars"]}
          additionalCheck={({ settings }) =>
            settings.plugins["thread:betterMessageToolbars"]
              .wordsAndCharactersCount
          }
        >
          <QueryWordsAndCharactersCount messageBlockIndex={index} />
          <Divider />
        </CsUiPluginsGuard>
      </div>
    </Portal>
  ));
}

function Divider() {
  return (
    <div className="m-[1.5px] w-px border-r border-borderMain/50 ring-borderMain/50 divide-borderMain/50 dark:divide-borderMainDark/50 dark:ring-borderMainDark/50 dark:border-borderMainDark/50 bg-transparent x-h-[21px]" />
  );
}
