import { findReactFiberNodeValue } from "@/plugins/_core/main-world/react-vdom/utils";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";
import { errorWrapper } from "@/utils/error-wrapper";
import { getReactFiberKey } from "@/utils/utils";

export function getCodeBlockContent(params: {
  messageBlockIndex: number;
  codeBlockIndex: number;
}): {
  code: string;
  language: string;
} | null {
  const { messageBlockIndex, codeBlockIndex } = params;
  const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.CODE_BLOCK}"][data-index="${codeBlockIndex}"] pre`;

  const $el = $(selector);

  if (!$el[0]) return null;

  const fiberNode = ($el[0] as any)[getReactFiberKey($el[0])];

  const [code, error] = errorWrapper(() =>
    findReactFiberNodeValue({
      fiberNode,
      condition: (node) => node.memoizedProps.children.props.children != null,
      select: (node) => node.memoizedProps.children.props.children as string,
    }),
  )();

  const [language, error2] = errorWrapper(() =>
    findReactFiberNodeValue({
      fiberNode,
      condition: (node) => node.memoizedProps.children.props.className != null,
      select: (node) => {
        const language = node.memoizedProps.children.props.className.replace(
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
}
