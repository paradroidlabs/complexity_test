import { Portal } from "@/components/ui/portal";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui/groups/query-box/context/context";
import { createToolbarPortalContainers } from "@/plugins/_core/ui/groups/query-box/utils";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector/Wrapper";
import SlashCommandMenuTriggerButtonWrapper from "@/plugins/slash-command-menu/TriggerButtonWrapper";
import SlashCommandMenuWrapper from "@/plugins/slash-command-menu/Wrapper";

export default function FollowUpQueryBoxWrapper() {
  const followUpQueryBox = queryBoxesDomObserverStore(
    (store) => store.followUp.$followUpQueryBox?.[0],
    deepEqual,
  );

  if (!followUpQueryBox) return null;

  const { leftToolbar } = createToolbarPortalContainers({
    queryBox: followUpQueryBox,
  });

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "follow-up" }}>
      <Portal container={leftToolbar.leftContainer}>
        <BetterLanguageModelSelectorWrapper />
      </Portal>
      <Portal container={leftToolbar.rightContainer}>
        <SlashCommandMenuTriggerButtonWrapper />
        <SlashCommandMenuWrapper anchor={followUpQueryBox} />
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
