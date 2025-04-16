import { Portal } from "@/components/ui/portal";
import { queryBoxesDomObserverStore } from "@/plugins/_core/dom-observers/query-boxes/store";
import { ScopedQueryBoxContextProvider } from "@/plugins/_core/ui/groups/query-box/context/context";
import { createToolbarPortalContainers } from "@/plugins/_core/ui/groups/query-box/utils";
import ForceWritingModeToggle from "@/plugins/force-writing-mode/Wrapper";
import BetterLanguageModelSelectorWrapper from "@/plugins/language-model-selector/Wrapper";
import SlashCommandMenuTriggerButtonWrapper from "@/plugins/slash-command-menu/TriggerButtonWrapper";
import SlashCommandMenuWrapper from "@/plugins/slash-command-menu/Wrapper";
import SpaceNavigatorWrapper from "@/plugins/space-navigator/query-box/Wrapper";

export default function SpaceQueryBoxWrapper() {
  const spaceQueryBox = queryBoxesDomObserverStore(
    (store) => store.main.$spaceQueryBox?.[0],
    deepEqual,
  );

  if (!spaceQueryBox) return null;

  const { leftToolbar, rightToolbar } = createToolbarPortalContainers({
    queryBox: spaceQueryBox,
  });

  return (
    <ScopedQueryBoxContextProvider storeValue={{ type: "space" }}>
      <Portal container={leftToolbar.leftContainer}>
        <BetterLanguageModelSelectorWrapper />
      </Portal>
      <Portal container={leftToolbar.rightContainer}>
        <div className="x:flex x:size-full x:flex-wrap x:items-center x:gap-2">
          <SlashCommandMenuTriggerButtonWrapper />
          <SpaceNavigatorWrapper />
        </div>
        <SlashCommandMenuWrapper anchor={spaceQueryBox} />
      </Portal>
      <Portal container={rightToolbar.leftContainer}>
        <ForceWritingModeToggle />
      </Portal>
    </ScopedQueryBoxContextProvider>
  );
}
