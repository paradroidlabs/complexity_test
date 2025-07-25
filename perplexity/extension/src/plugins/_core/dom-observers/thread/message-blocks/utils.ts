import { sendMessage } from "webext-bridge/content-script";

import { messageBlocksReactFiberNodePathResourceConfig } from "@/plugins/_core/dom-observers/thread/message-blocks/index.remote-resources";
import type { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { type MessageBlockFiberData } from "@/plugins/_core/main-world/react-vdom/actions/get-messages";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";
import { getVersionedRemoteResource } from "@/services/cplx-api/versioned-remote-resources/utils";
import { UiUtils } from "@/utils/ui-utils";

const remoteFiberNodePath = (
  await getVersionedRemoteResource(
    messageBlocksReactFiberNodePathResourceConfig,
  )
).split(".");

export async function findMessageBlocks(): Promise<MessageBlock[] | null> {
  const $threadMessagesContainer = UiUtils.getMessagesContainer();

  if (!$threadMessagesContainer[0]) return null;

  const $messageBlockElements = $threadMessagesContainer.find(
    `>${DomSelectorsService.cachedSync.THREAD.MESSAGE.OUTER_WRAPPER}`,
  );

  const messageBlocksFiberData = await sendMessage(
    "reactVdom:getMessages",
    {
      remoteFiberNodePath: remoteFiberNodePath ?? undefined,
    },
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
    .internalComponentAttr(
      DomSelectorsService.internalAttributes.THREAD.MESSAGE.BLOCK,
    )
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
      $query.find(DomSelectorsService.cachedSync.THREAD.MESSAGE.QUERY).text(),
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
  const selectors = DomSelectorsService.cachedSync.THREAD.MESSAGE;

  const $elements = $messageBlock.find(
    [
      selectors.QUERY_WRAPPER,
      selectors.SOURCES,
      selectors.ANSWER,
      selectors.BOTTOM_BAR,
    ].join(", "),
  );

  const $query = $elements.filter(selectors.QUERY_WRAPPER);
  const $sources = $elements.filter(selectors.SOURCES);
  const $answer = $elements.filter(selectors.ANSWER);
  const $bottomBar = $elements.filter(selectors.BOTTOM_BAR);

  const $queryHoverContainer = $query.find(selectors.QUERY_HOVER_CONTAINER);

  $query.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.MESSAGE.QUERY,
  );
  $queryHoverContainer.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.MESSAGE.QUERY_HOVER_CONTAINER,
  );
  $answer.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.MESSAGE.ANSWER,
  );
  $bottomBar.internalComponentAttr(
    DomSelectorsService.internalAttributes.THREAD.MESSAGE.BOTTOM_BAR,
  );

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

  const hasInnerWrapper =
    $wrapper.find(DomSelectorsService.cachedSync.THREAD.MESSAGE.INNER_WRAPPER)
      .length > 0;
  const isVirtualized = !hasInnerWrapper;

  const isInFlight = isVirtualized
    ? false
    : (messageBlockFiber?.isInFlight ?? $bottomBar[0] == null);

  $wrapper.attr("data-inflight", isInFlight ? "true" : "false");

  const isEditingQuery =
    $query.find(DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX.EDIT_QUERY)
      .length > 0;

  const isReadOnly = (() => {
    const existingReadOnlyAttr = $wrapper.attr("data-read-only");

    if (existingReadOnlyAttr != null && existingReadOnlyAttr === "false")
      return false;

    const isQueryHoverContainerPresent =
      $query.find(
        DomSelectorsService.cachedSync.THREAD.MESSAGE.QUERY_HOVER_CONTAINER,
      ).length > 0;

    $wrapper.attr(
      "data-read-only",
      isQueryHoverContainerPresent ? "false" : "true",
    );

    return !isQueryHoverContainerPresent;
  })();

  return {
    isReadOnly,
    isInFlight,
    isEditingQuery,
    isVirtualized,
  };
}
