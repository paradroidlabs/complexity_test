import { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";
import { INTERNAL_ATTRIBUTES, DOM_SELECTORS } from "@/utils/dom-selectors";
import { UiUtils } from "@/utils/ui-utils";

export async function findMessageBlocks(): Promise<MessageBlock[] | null> {
  const $messagesContainer = UiUtils.getMessagesContainer();

  if (!$messagesContainer.length) return null;

  const children = Array.from($messagesContainer[0].children).filter(
    (child) =>
      child.querySelector(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL) !== null,
  );

  const messageBlocks = await Promise.all(
    children.map(async (messageBlock, i) => {
      if (messageBlock == null) return null;

      const $wrapper = $(messageBlock as HTMLElement);

      $wrapper
        .internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK)
        .attr("data-index", i);

      const parsedBlock = parseMessageBlock($wrapper);
      const {
        $query,
        $queryHoverContainer,
        $sources,
        $answerHeading,
        $answer,
        $bottomBar,
      } = parsedBlock;

      const $textCol = $wrapper.find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL);
      const $visualCol = $wrapper.find(DOM_SELECTORS.THREAD.MESSAGE.VISUAL_COL);

      $query.internalComponentAttr(
        INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY,
      );
      $queryHoverContainer.internalComponentAttr(
        INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_HOVER_CONTAINER,
      );
      $answer.internalComponentAttr(
        INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER,
      );
      $answerHeading.internalComponentAttr(
        INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.ANSWER_HEADING,
      );
      $bottomBar.internalComponentAttr(
        INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL_CHILD.BOTTOM_BAR,
      );
      $textCol.internalComponentAttr(
        INTERNAL_ATTRIBUTES.THREAD.MESSAGE.TEXT_COL,
      );
      $visualCol.internalComponentAttr(
        INTERNAL_ATTRIBUTES.THREAD.MESSAGE.VISUAL_COL,
      );

      const nodes: MessageBlock["nodes"] = {
        $wrapper,
        $query,
        $sources,
        $answerHeading,
        $answer,
        $queryHoverContainer,
        $bottomBar,
      };

      const content = getMessageBlockContent({ messageBlockNodes: nodes });
      const states = getMessageBlockStates({
        messageBlockNodes: nodes,
      });

      return {
        nodes,
        content,
        states,
      };
    }),
  );

  return messageBlocks.filter((block): block is MessageBlock => block !== null);
}

function parseMessageBlock($messageBlock: JQuery<Element>) {
  const selectors = DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD;

  const $query = $messageBlock.find(selectors.QUERY_WRAPPER);
  const $queryHoverContainer = $query.find(selectors.QUERY_HOVER_CONTAINER);
  const $sources = $messageBlock.find(selectors.SOURCES);
  const $answerHeading = $messageBlock.find(selectors.ANSWER_HEADING);
  const $answer = $messageBlock.find(selectors.ANSWER);
  const $bottomBar = $messageBlock.find(selectors.BOTTOM_BAR);

  if ($bottomBar.length) {
    requestAnimationFrame(() => {
      $(document.body).css({
        "--message-block-bottom-bar-height": `${$bottomBar[0].offsetHeight - 1}px`,
      });
    });
  }

  return {
    $messageBlock,
    $query,
    $queryHoverContainer,
    $sources,
    $answerHeading,
    $answer,
    $bottomBar,
  };
}

function getMessageBlockStates({
  messageBlockNodes,
}: {
  messageBlockNodes: MessageBlock["nodes"];
}): MessageBlock["states"] {
  const { $wrapper, $query, $bottomBar } = messageBlockNodes;

  const isInFlight = !$bottomBar.length;

  $wrapper.attr("data-inflight", isInFlight ? "true" : "false");

  const isEditingQuery = $query.find("textarea").length > 0;
  const isQueryHoverContainerPresent =
    $query.find(
      DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_HOVER_CONTAINER,
    ).length > 0;

  const existingReadOnlyAttr = $wrapper.attr("data-read-only");

  if (existingReadOnlyAttr == null || existingReadOnlyAttr === "true") {
    $wrapper.attr(
      "data-read-only",
      !isQueryHoverContainerPresent ? "true" : "false",
    );
  }

  const isReadOnly =
    existingReadOnlyAttr !== "false" ? !isQueryHoverContainerPresent : false;

  return {
    isInFlight,
    isEditingQuery,
    isReadOnly,
  };
}

function getMessageBlockContent({
  messageBlockNodes,
}: {
  messageBlockNodes: MessageBlock["nodes"];
}): MessageBlock["content"] {
  const { $query } = messageBlockNodes;

  const title = $query
    .find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY)
    .text();

  return {
    title,
  };
}
