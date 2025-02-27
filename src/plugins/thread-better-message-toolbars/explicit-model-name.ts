import { sendMessage } from "webext-bridge/content-script";

import { languageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import { isLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { pplxCookiesStore } from "@/data/pplx-cookies-store";
import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

const MODEL_BADGE_COMPONENT_SELECTOR = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING_MODEL_NAME}"]`;

function createModelBadge(modelName: string) {
  return $(`<div>${modelName}</div>`)
    .addClass("x-font-medium x-text-sm md:x-text-base")
    .internalComponentAttr(
      INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD
        .ANSWER_HEADING_MODEL_NAME,
    );
}

async function displayModelBadge({
  $bottomBar,
  $answerHeading,
  isInFlight,
  index,
}: {
  $bottomBar: JQuery<HTMLElement>;
  $answerHeading: JQuery<HTMLElement>;
  isInFlight: boolean;
  index: number;
}) {
  if (isInFlight) {
    $answerHeading.find(MODEL_BADGE_COMPONENT_SELECTOR).remove();
    $answerHeading.find(":nth-child(2)").removeClass("x-hidden");
    return;
  }

  if (!$bottomBar.length) return;

  const modelCode = await sendMessage(
    "reactVdom:getMessageDisplayModelCode",
    { index },
    "window",
  );

  if (!modelCode || !isLanguageModelCode(modelCode)) return;

  const model = languageModels.find((model) => model.code === modelCode);
  if (!model) return;

  const $exisitingBadge = $answerHeading.find(MODEL_BADGE_COMPONENT_SELECTOR);

  if ($exisitingBadge.length) return;

  // Hide the native badge and the "Answer" text
  const $target = $answerHeading.find('[color="super"]');
  if (!$target.length) return;

  $target.find(":nth-child(2)").addClass("x-hidden");
  $bottomBar
    .find("button:has(svg.tabler-icon-cpu)")
    .parent()
    .addClass("x-hidden");

  const modelNameElement = createModelBadge(model.label);
  $target.append(modelNameElement);
}

function explicitModelName(messageBlocks: MessageBlock[]) {
  const pluginsEnableStates = PluginsStatesService.getEnableStatesCachedSync();
  if (
    !pluginsEnableStates["thread:betterMessageToolbars"] ||
    !ExtensionLocalStorageService.getCachedSync().plugins[
      "thread:betterMessageToolbars"
    ].explicitModelName
  )
    return;

  messageBlocks.forEach(
    (
      { nodes: { $answerHeading, $bottomBar }, states: { isInFlight } },
      index,
    ) => {
      displayModelBadge({ $bottomBar, $answerHeading, isInFlight, index });
    },
  );
}

csLoaderRegistry.register({
  id: "plugin:thread:betterMessageToolbars:explicitModelName",
  dependencies: [
    "cache:pluginsStates",
    "cache:extensionLocalStorage",
    "cache:languageModels",
  ],
  loader: () => {
    const pluginsEnableStates =
      PluginsStatesService.getEnableStatesCachedSync();
    const settings = ExtensionLocalStorageService.getCachedSync();

    if (
      !pluginsEnableStates["thread:betterMessageToolbars"] ||
      !settings.plugins["thread:betterMessageToolbars"].explicitModelName
    )
      return;

    threadMessageBlocksDomObserverStore.subscribe(
      (store) => store.messageBlocks,
      (messageBlocks) => {
        explicitModelName(messageBlocks ?? []);
      },
      {
        equalityFn: deepEqual,
      },
    );

    pplxCookiesStore.subscribe(
      (store) => store.cookies,
      (cookies) => {
        const isIncognito =
          cookies.find((cookie) => cookie.name === "pplx.is-incognito")
            ?.value === "true";

        if (isIncognito) return;

        threadMessageBlocksDomObserverStore
          .getState()
          .messageBlocks?.forEach((messageBlock) => {
            messageBlock.nodes.$bottomBar
              .find("button:has(svg.tabler-icon-cpu)")
              .parent()
              .addClass("x-hidden");
          });
      },
    );
  },
});
