import { Portal } from "@/components/ui/portal";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui/groups/query-box/context/context";
import { createToolbarPortalContainers } from "@/plugins/_core/ui/groups/query-box/utils";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector/Wrapper";
import SlashCommandMenuTriggerButtonWrapper from "@/plugins/slash-command-menu/TriggerButtonWrapper";
import SlashCommandMenuWrapper from "@/plugins/slash-command-menu/Wrapper";
import SpaceNavigatorWrapper from "@/plugins/space-navigator/query-box/Wrapper";

export default function MainQueryBoxWrapper() {
  const mainQueryBox = queryBoxesDomObserverStore(
    (store) => store.main.$mainQueryBox?.[0],
    deepEqual,
  );

  if (!mainQueryBox) return null;

  const { leftToolbar } = createToolbarPortalContainers({
    queryBox: mainQueryBox,
  });

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "main" }}>
      <Portal container={leftToolbar.leftContainer}>
        <BetterLanguageModelSelectorWrapper />
      </Portal>
      <Portal container={leftToolbar.rightContainer}>
        <div className="x:flex x:size-full x:flex-wrap x:items-center">
          <SlashCommandMenuTriggerButtonWrapper />
          <SpaceNavigatorWrapper />
        </div>
        <SlashCommandMenuWrapper anchor={mainQueryBox} />
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
