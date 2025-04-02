import { sendMessage } from "webext-bridge/content-script";

import { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { MessageBlockFiberData } from "@/plugins/_core/react-vdom/actions/get-messages";
import { INTERNAL_ATTRIBUTES, DOM_SELECTORS } from "@/utils/dom-selectors";
import { UiUtils } from "@/utils/ui-utils";
import { setCssProperty } from "@/utils/utils";

export async function findMessageBlocks(): Promise<MessageBlock[] | null> {
  const $threadMessagesContainer = UiUtils.getMessagesContainer();
  if (!$threadMessagesContainer[0]) return null;

  const $messageBlockElements = $threadMessagesContainer.eq(0).children();

  const messageBlocksFiberData = await sendMessage(
    "reactVdom:getMessages",
    undefined,
    "window",
  );

  const messageBlocksPromises = $messageBlockElements
    .toArray()
    .map((messageBlockNode, idx) => {
      return processMessageBlock(
        messageBlocksFiberData?.[idx],
        $(messageBlockNode),
        idx,
      );
    });

  const resolvedMessageBlocks = await Promise.all(messageBlocksPromises);

  return resolvedMessageBlocks.filter(Boolean) as MessageBlock[];
}

async function processMessageBlock(
  messageBlockFiber: MessageBlockFiberData | undefined,
  $wrapper: JQuery<HTMLElement>,
  index: number,
): Promise<MessageBlock | null> {
  $wrapper
    .internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK)
    .attr("data-index", index);

  const parsedBlock = parseMessageBlock($wrapper);
  const { $query, $queryHoverContainer, $sources, $answer, $bottomBar } =
    parsedBlock;

  const nodes: MessageBlock["nodes"] = {
    $wrapper,
    $query,
    $sources,
    $answer,
    $queryHoverContainer,
    $bottomBar,
  };

  const content: MessageBlock["content"] = {
    title:
      messageBlockFiber?.title ??
      $query.find(DOM_SELECTORS.THREAD.MESSAGE.QUERY).text(),
    answer: messageBlockFiber?.answer ?? "",
    webResults: messageBlockFiber?.webResults ?? [],
    displayModel: messageBlockFiber?.displayModel ?? "",
    backendUuid: messageBlockFiber?.backendUuid ?? "",
    authorUuid: messageBlockFiber?.authorUuid ?? "",
  };

  const states: MessageBlock["states"] = getMessageBlockStates({
    messageBlockNodes: nodes,
    messageBlockFiber,
  });

  return {
    nodes,
    content,
    states,
  };
}

function parseMessageBlock($messageBlock: JQuery<Element>) {
  const selectors = DOM_SELECTORS.THREAD.MESSAGE;

  const $query = $messageBlock.find(selectors.QUERY_WRAPPER);
  const $queryHoverContainer = $query.find(selectors.QUERY_HOVER_CONTAINER);
  const $sources = $messageBlock.find(selectors.SOURCES);
  const $answer = $messageBlock.find(selectors.ANSWER);
  const $bottomBar = $messageBlock.find(selectors.BOTTOM_BAR);

  $query.internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.MESSAGE.QUERY);
  $queryHoverContainer.internalComponentAttr(
    INTERNAL_ATTRIBUTES.THREAD.MESSAGE.QUERY_HOVER_CONTAINER,
  );
  $answer.internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.MESSAGE.ANSWER);
  $bottomBar.internalComponentAttr(
    INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BOTTOM_BAR,
  );

  if ($bottomBar[0]) {
    const newHeight = `${$bottomBar[0].offsetHeight}px`;
    const currentValue = getComputedStyle(document.body).getPropertyValue(
      "--message-block-bottom-bar-height",
    );

    if (currentValue !== newHeight) {
      setCssProperty("--message-block-bottom-bar-height", newHeight);
    }
  }

  return {
    $messageBlock,
    $query,
    $queryHoverContainer,
    $sources,
    $answer,
    $bottomBar,
  };
}

function getMessageBlockStates({
  messageBlockNodes,
  messageBlockFiber,
}: {
  messageBlockNodes: MessageBlock["nodes"];
  messageBlockFiber: MessageBlockFiberData | undefined;
}): MessageBlock["states"] {
  const { $wrapper, $query, $bottomBar } = messageBlockNodes;

  const isVirtualized =
    $wrapper.find(DOM_SELECTORS.THREAD.MESSAGE.INNER_WRAPPER)[0] == null;

  const isInFlight = isVirtualized
    ? false
    : (messageBlockFiber?.isInFlight ?? $bottomBar[0] == null);

  $wrapper.attr("data-inflight", isInFlight ? "true" : "false");

  const isEditingQuery = $query.find("textarea").length > 0;

  return {
    isInFlight,
    isEditingQuery,
    isVirtualized,
  };
}
