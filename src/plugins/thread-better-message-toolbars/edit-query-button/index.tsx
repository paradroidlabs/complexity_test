import FaPencilSquare from "@/components/icons/FaPencilSquare";
import {
  threadMessageBlocksDomObserverStore,
  useThreadMessageBlocksDomObserverStore,
} from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

export default function EditQueryButton({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  const isEditingQuery = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.states.isEditingQuery,
    deepEqual,
  );

  const isReadOnly = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[messageBlockIndex]?.states.isReadOnly,
    deepEqual,
  );

  const isAnyMessageBlockInFlight = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.some((block) => block.states.isInFlight),
    deepEqual,
  );

  if (isReadOnly || isEditingQuery || isAnyMessageBlockInFlight) return null;

  return (
    <div
      role="button"
      className="x-cursor-pointer x-rounded-md x-p-2 x-text-base x-text-muted-foreground x-transition-all x-animate-in x-fade-in hover:x-bg-muted/50 hover:x-text-foreground active:x-scale-95"
      onClick={() => {
        const $editQueryButton = threadMessageBlocksDomObserverStore
          .getState()
          .messageBlocks?.[
            messageBlockIndex
          ]?.nodes.$queryHoverContainer.find(DOM_SELECTORS.THREAD.MESSAGE.TEXT_COL_CHILD.QUERY_HOVER_CONTAINER_CHILD.EDIT_QUERY_BUTTON);

        if (!$editQueryButton || !$editQueryButton.length) return;

        $editQueryButton.trigger("click");
      }}
    >
      <FaPencilSquare className="x-size-3.5" />
    </div>
  );
}
