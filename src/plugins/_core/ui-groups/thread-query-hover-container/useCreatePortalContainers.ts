import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";

const OBSERVER_ID = "query-hover-container-cplx-toolbars-wrapper";

export function useCreatePortalContainers(): (Element | null)[] {
  const messageBlocks = useThreadMessageBlocksDomObserverStore(
    (state) => state.messageBlocks,
    deepEqual,
  );

  if (messageBlocks == null) return [];

  return messageBlocks.map((messageBlock) => {
    if (messageBlock.states.isEditingQuery || messageBlock.states.isInFlight)
      return null;

    const $target = messageBlock.nodes.$queryHoverContainer.find(
      ">div.bg-background-100",
    );

    const $existingPortalContainer = $target.find(
      `div[data-cplx-component="${OBSERVER_ID}"]`,
    );

    if ($existingPortalContainer.length) return $existingPortalContainer[0];

    const $portalContainer = $("<div>").internalComponentAttr(OBSERVER_ID);

    $target.prepend($portalContainer);

    return $portalContainer[0];
  });
}
