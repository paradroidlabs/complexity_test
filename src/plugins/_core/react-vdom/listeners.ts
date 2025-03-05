import { onMessage } from "webext-bridge/window";

import { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { INTERNAL_ATTRIBUTES, DOM_SELECTORS } from "@/utils/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { PplxWebResult } from "@/utils/thread-export";
import { getReactFiberKey } from "@/utils/utils";

export type ReactVdomEvents = {
  "reactVdom:getMessageModelPreferences": (params: { index: number }) => {
    displayModel: LanguageModelCode;
    mode: string;
  } | null;
  "reactVdom:getMessageDisplayModelCode": (params: {
    index: number;
  }) => string | null;
  "reactVdom:getMessageContent": (params: { index: number }) => {
    answer: string;
    webResults: PplxWebResult[] | undefined;
  } | null;
  "reactVdom:getMessageBackendUuid": (params: {
    index: number;
  }) => string | null;
  "reactVdom:getCodeBlockContent": (params: {
    messageBlockIndex: number;
    codeBlockIndex: number;
  }) => {
    code: string;
    language: string;
  } | null;
  "reactVdom:triggerRewriteOption": (params: {
    messageBlockIndex: number;
    optionIndex?: number;
  }) => boolean;
  "reactVdom:syncNativeModelSelector": (params: { searchMode: string }) => void;
};

export function setupReactVdomListeners() {
  onMessage("reactVdom:getMessageModelPreferences", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${index}"]`;

    const $el = $(selector).prev();

    if (!$el.length) return null;

    const [preferences, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          node.return.memoizedProps.result != null &&
          node.return.memoizedProps.result.mode != null &&
          node.return.memoizedProps.result.is_pro_reasoning_mode != null &&
          node.return.memoizedProps.result.display_model != null,
        select: (node) =>
          node.return.memoizedProps.result as {
            mode: string;
            is_pro_reasoning_mode: boolean;
            display_model: LanguageModelCode;
          },
      }),
    )();

    if (error) console.warn("[VDOM Plugin] getMessageModelPreferences", error);

    if (error || preferences == null) return null;

    return {
      // isProReasoningMode: preferences.is_pro_reasoning_mode,
      mode: preferences.mode,
      displayModel: preferences.display_model,
    };
  });

  onMessage("reactVdom:getMessageDisplayModelCode", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${index}"]`;

    const $el = $(selector).prev();

    if (!$el.length) return null;

    const [modelCode, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          node.return.memoizedProps.result.display_model != null,
        select: (node) =>
          node.return.memoizedProps.result.display_model as string,
      }),
    )();

    if (error) console.warn("[VDOM Plugin] getMessageDisplayModelCode", error);

    if (error || modelCode == null) return null;

    return modelCode;
  });

  onMessage("reactVdom:getMessageContent", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${index}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER}"] div[dir="auto"]`;

    const $el = $(selector);

    if (!$el.length) return null;

    const [result, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          node.memoizedProps.children[3].props.response != null,
        select: (node) => ({
          answer: node.memoizedProps.children[3].props.response
            .answer as string,
          webResults: node.memoizedProps.children[3].props.response
            ?.web_results as PplxWebResult[] | undefined,
        }),
      }),
    )();

    if (error) console.warn("[VDOM Plugin] getMessageContent", error);

    return result;
  });

  onMessage("reactVdom:getMessageBackendUuid", ({ data: { index } }) => {
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${index}"]`;

    const $el = $(selector).prev();

    if (!$el.length) return null;

    const [backendUuid, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode: ($el[0] as any)[getReactFiberKey($el[0])],
        condition: (node) =>
          node.return.memoizedProps.result.backend_uuid != null,
        select: (node) =>
          node.return.memoizedProps.result.backend_uuid as string,
      }),
    )();

    if (error) console.warn("[VDOM Plugin] getMessageBackendUuid", error);

    if (error || backendUuid == null) return null;

    return backendUuid;
  });

  onMessage(
    "reactVdom:getCodeBlockContent",
    ({ data: { messageBlockIndex, codeBlockIndex } }) => {
      const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.CODE_BLOCK}"][data-index="${codeBlockIndex}"] pre`;

      const $el = $(selector);

      if (!$el.length) return null;

      const fiberNode = ($el[0] as any)[getReactFiberKey($el[0])];

      const [code, error] = errorWrapper(() =>
        findReactFiberNodeValue({
          fiberNode,
          condition: (node) =>
            node.memoizedProps.children.props.children != null,
          select: (node) =>
            node.memoizedProps.children.props.children as string,
        }),
      )();

      const [language, error2] = errorWrapper(() =>
        findReactFiberNodeValue({
          fiberNode,
          condition: (node) =>
            node.memoizedProps.children.props.className != null,
          select: (node) => {
            const language =
              node.memoizedProps.children.props.className.replace(
                /^language-/,
                "",
              );

            return language;
          },
        }),
      )();

      if (error || code == null) return null;

      return {
        code,
        language: error2 || language == null ? "text" : language,
      };
    },
  );

  onMessage(
    "reactVdom:triggerRewriteOption",
    ({ data: { messageBlockIndex, optionIndex } }) => {
      const selector = `div[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR}"] ${DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR_CHILD.REWRITE_BUTTON}`;

      const $rewriteButtonWrapper = $(selector).parent().parent();

      if (!$rewriteButtonWrapper.length) return false;

      const fiberNode = ($rewriteButtonWrapper[0] as any)[
        getReactFiberKey($rewriteButtonWrapper[0])
      ];

      if (fiberNode == null) return false;

      const [triggerRewriteOptionHandler, error] = errorWrapper(() =>
        findReactFiberNodeValue({
          fiberNode,
          condition: (node) => {
            const items = node.memoizedProps.children.props.items;
            const index = optionIndex ?? items.length - 3;
            return items[index].onClick != null;
          },
          select: (node) => {
            const items = node.memoizedProps.children.props.items;
            const index = optionIndex ?? items.length - 3;
            return items[index].onClick as () => void;
          },
        }),
      )();

      if (error || triggerRewriteOptionHandler == null) return false;

      triggerRewriteOptionHandler();

      return true;
    },
  );

  onMessage("reactVdom:syncNativeModelSelector", ({ data: { searchMode } }) => {
    const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.PPLX_COMPONENTS_WRAPPER}"]:last > :first-child`;

    const $modelSelector = $(selector);

    if (!$modelSelector.length) return;

    const fiberNode = ($modelSelector[0] as any)[
      getReactFiberKey($modelSelector[0])
    ];

    if (fiberNode == null) return;

    const isMobile = isMobileStore.getState().isMobile;

    const [items, error] = errorWrapper(() =>
      findReactFiberNodeValue({
        fiberNode,
        condition: (node) => {
          if (!isMobile) return node.return.return.memoizedProps.items != null;

          return node.return.memoizedProps.items != null;
        },
        select: (node) => {
          if (!isMobile)
            return node.return.return.memoizedProps.items as {
              onClick: () => void;
              value: "default" | "pro" | LanguageModelCode;
            }[];

          return node.return.memoizedProps.items as {
            onClick: () => void;
            value: "default" | "pro" | LanguageModelCode;
          }[];
        },
      }),
    )();

    if (error || items == null) return;

    const item = items.find((item) => item.value === searchMode);

    if (item == null) return;

    item.onClick();
  });
}

function findReactFiberNodeValue<T>({
  fiberNode,
  condition,
  select,
}: {
  fiberNode: any;
  condition: (fiberNode: any) => boolean;
  select: (fiberNode: any) => T;
}): T | null {
  if (fiberNode == null) return null;

  const tree = fiberNode.alternate ?? fiberNode;

  if (condition?.(tree)) return select?.(tree);

  return null;

  // return (
  //   // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  //   findReactFiberNodeValue({
  //     fiberNode: tree.child,
  //     condition,
  //     select,
  //   }) ||
  //   findReactFiberNodeValue({
  //     fiberNode: tree.sibling,
  //     condition,
  //     select,
  //   })
  // );
}
