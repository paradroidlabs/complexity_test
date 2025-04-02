import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { sendMessage } from "webext-bridge/content-script";

import { CodeBlock } from "@/plugins/_core/dom-observers/thread/code-blocks/types";
import { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { INTERNAL_ATTRIBUTES, DOM_SELECTORS } from "@/utils/dom-selectors";

export async function findCodeBlocks(
  messageBlocks: MessageBlock[],
): Promise<CodeBlock[][]> {
  const codeBlocksChunksPromises = messageBlocks.map((messageBlock, index) =>
    processCodeBlocksForMessageBlock(messageBlock, index, messageBlocks),
  );

  return Promise.all(codeBlocksChunksPromises);
}

async function processCodeBlocksForMessageBlock(
  messageBlock: MessageBlock | null,
  messageBlockIndex: number,
  messageBlocks: MessageBlock[],
): Promise<CodeBlock[]> {
  if (!messageBlock) return [];

  if (messageBlock.states.isVirtualized) {
    return parseCodeBlocksFromString(messageBlock);
  }

  const $codeBlockElements = $(messageBlock.nodes.$answer)
    .find(DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.WRAPPER)
    .toArray();

  const codeBlocksPromises = $codeBlockElements.map(
    async (codeBlockElement, codeBlockIndex) => {
      const $codeBlock = $(codeBlockElement);

      $codeBlock
        .internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.MESSAGE.CODE_BLOCK)
        .attr("data-index", codeBlockIndex);

      const $nativeCopyButton = $codeBlock.find(
        DOM_SELECTORS.THREAD.MESSAGE.CODE_BLOCK.NATIVE_COPY_BUTTON,
      );

      const content = await getCodeBlockContent({
        messageBlockIndex,
        codeBlockIndex,
        $wrapper: $codeBlock,
      });

      const states = {
        isInFlight: isCodeBlockInFlight({
          messageBlocks,
          messageBlockIndex,
          codeBlockIndex,
        }),
      };

      return {
        nodes: {
          $wrapper: $codeBlock,
          $nativeCopyButton,
        },
        content,
        states,
      } satisfies CodeBlock;
    },
  );

  return Promise.all(codeBlocksPromises);
}

const mdAstProcessor = unified().use(remarkParse).use(remarkGfm);

function parseCodeBlocksFromString(messageBlock: MessageBlock): CodeBlock[] {
  const ast = mdAstProcessor.parse(messageBlock.content.answer);

  const codeBlocks: CodeBlock[] = [];

  for (const [index, node] of ast.children.entries()) {
    if (node.type !== "code") continue;

    codeBlocks.push({
      nodes: {
        $wrapper: null,
        $nativeCopyButton: null,
      },
      content: {
        language: node.lang ?? "text",
        code: node.value,
      },
      states: {
        isInFlight:
          messageBlock.states.isInFlight &&
          ast.children[index + 1]?.type == null,
      },
    } satisfies CodeBlock);
  }

  return codeBlocks;
}

async function getCodeBlockContent({
  messageBlockIndex,
  codeBlockIndex,
  $wrapper,
}: {
  messageBlockIndex: number;
  codeBlockIndex: number;
  $wrapper: JQuery<HTMLElement>;
}): Promise<CodeBlock["content"]> {
  const data = await sendMessage(
    "reactVdom:getCodeBlockContent",
    {
      messageBlockIndex,

      codeBlockIndex,
    },
    "window",
  );

  return {
    language:
      data?.language ??
      $wrapper.find(".text-text-200.font-thin:last").text() ??
      "text",
    code: data?.code ?? $wrapper.find("code:last").text() ?? "",
  };
}

function isCodeBlockInFlight({
  messageBlocks,

  messageBlockIndex,
  codeBlockIndex,
}: {
  messageBlocks: MessageBlock[];
  messageBlockIndex: number;
  codeBlockIndex: number;
}) {
  const isMessageBlockInFlight =
    messageBlocks[messageBlockIndex]?.states.isInFlight;

  if (!isMessageBlockInFlight) return false;

  const codeBlock = document.querySelector(
    `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.CODE_BLOCK}"][data-index="${codeBlockIndex}"]`,
  );

  let parentElement = codeBlock?.parentElement;

  const hasAnimationWrapper = parentElement?.classList.contains("animate-in");

  if (hasAnimationWrapper) {
    return parentElement?.nextElementSibling == null;
  }

  const hasNextCodeBlock = document.querySelector(
    `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.CODE_BLOCK}"][data-index="${codeBlockIndex + 1}"]`,
  );

  if (hasNextCodeBlock) return false;

  return codeBlock?.nextElementSibling == null;
}
