import CsUiPluginsGuard from "@/components/plugins-guard/CsUiPluginsGuard";
import { usePluginGuardsStore } from "@/components/plugins-guard/store";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useSpaRouter } from "@/plugins/_api/spa-router/listeners";
import followUpQueryBoxCss from "@/plugins/_core/ui-groups/query-box/follow-up-query-box.css?inline";
import FollowUpQueryBoxWrapper from "@/plugins/_core/ui-groups/query-box/FollowUp";
import MainQueryBoxWrapper from "@/plugins/_core/ui-groups/query-box/Main";
import mainQueryBoxCss from "@/plugins/_core/ui-groups/query-box/main-query-box.css?inline";
import MainModalQueryBoxWrapper from "@/plugins/_core/ui-groups/query-box/MainModal";
import SpaceQueryBoxWrapper from "@/plugins/_core/ui-groups/query-box/Space";
import { shouldEnableUiGroup } from "@/plugins/_core/ui-groups/utils";
import hideNativeModelSelector from "@/plugins/language-model-selector/hide-native-model-selector.css?inline";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { whereAmI } from "@/utils/utils";

const shouldEnableToolbar = shouldEnableUiGroup({
  uiGroup: "queryBoxes:toolbar",
});

export default function QueryBoxWrapper() {
  useInsertToolbarCss();

  return (
    <CsUiPluginsGuard additionalCheck={() => shouldEnableToolbar}>
      <MainQueryBoxWrapper />
      <MainModalQueryBoxWrapper />
      <SpaceQueryBoxWrapper />
      <FollowUpQueryBoxWrapper />
    </CsUiPluginsGuard>
  );
}

function useInsertToolbarCss() {
  const location = whereAmI(useSpaRouter().url);

  const { hasActiveSub, isMobile } = usePluginGuardsStore();

  const pluginsEnableStates = PluginsStatesService.getEnableStatesCachedSync();

  const settings = ExtensionLocalStorageService.getCachedSync();

  const shouldInjectMain =
    pluginsEnableStates["queryBox:languageModelSelector"] ||
    pluginsEnableStates["spaceNavigator"] ||
    (pluginsEnableStates["queryBox:slashCommandMenu"] &&
      settings?.plugins["queryBox:slashCommandMenu"].showTriggerButton);

  const shouldInjectFollowUp =
    location === "thread" &&
    (pluginsEnableStates["queryBox:languageModelSelector"] ||
      (isMobile && pluginsEnableStates["spaceNavigator"]) ||
      (pluginsEnableStates["queryBox:slashCommandMenu"] &&
        settings?.plugins["queryBox:slashCommandMenu"].showTriggerButton));

  useInsertCss({
    id: "main-query-box",
    css: mainQueryBoxCss,
    inject: shouldInjectMain,
  });

  useInsertCss({
    id: "follow-up-query-box",
    css: followUpQueryBoxCss,
    inject: shouldInjectFollowUp,
  });

  useInsertCss({
    id: "hide-native-model-selector",
    css: hideNativeModelSelector,
    inject:
      hasActiveSub && pluginsEnableStates["queryBox:languageModelSelector"],
  });
}
