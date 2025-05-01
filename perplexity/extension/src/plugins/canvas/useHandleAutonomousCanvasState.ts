import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useThreadCodeBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/code-blocks/store";
import { CANVAS_INITIAL_STATE } from "@/plugins/canvas/canvases";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";
import type { CanvasLanguage } from "@/plugins/canvas/types";
import {
  getInterpretedCanvasLanguage,
  isAutonomousCanvasLanguageString,
} from "@/plugins/canvas/utils";

export default function useHandleAutonoumousCanvasState() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const isCanvasOpen = selectedCodeBlockLocation !== null;
  const hasAutoPreviewTriggered = useCanvasStore(
    (state) => state.hasAutoPreviewTriggered,
  );
  const codeBlocksChunks = useThreadCodeBlocksDomObserverStore(
    (store) => store.codeBlocksChunks,
    deepEqual,
  );

  useEffect(
    function handleInFlightCodeBlocks() {
      if (!codeBlocksChunks) return;

      messageBlockLoop: for (
        let chunkIndex = codeBlocksChunks.length - 1;
        chunkIndex >= 0;
        chunkIndex--
      ) {
        const messageBlock = codeBlocksChunks[chunkIndex];

        if (!messageBlock) continue;

        for (
          let codeIndex = messageBlock.length - 1;
          codeIndex >= 0;
          codeIndex--
        ) {
          const codeBlock = messageBlock[codeIndex];

          if (!codeBlock) continue;

          if (
            !codeBlock.content.language ||
            !isAutonomousCanvasLanguageString(codeBlock.content.language)
          )
            continue;

          const isCurrentlySelected =
            chunkIndex === selectedCodeBlockLocation?.messageBlockIndex &&
            codeIndex === selectedCodeBlockLocation?.codeBlockIndex;

          if (!codeBlock.states.isInFlight || isCurrentlySelected) continue;

          const lastAutoOpenCodeBlockLocation =
            canvasStore.getState().lastAutoOpenCodeBlockLocation;

          if (
            lastAutoOpenCodeBlockLocation &&
            lastAutoOpenCodeBlockLocation.messageBlockIndex === chunkIndex &&
            lastAutoOpenCodeBlockLocation.codeBlockIndex === codeIndex
          )
            continue;

          canvasStore.setState((draft) => {
            draft.selectedCodeBlockLocation = {
              messageBlockIndex: chunkIndex,
              codeBlockIndex: codeIndex,
            };
            draft.state =
              CANVAS_INITIAL_STATE[
                getInterpretedCanvasLanguage(
                  codeBlock.content.language as CanvasLanguage,
                ) as CanvasLanguage
              ];
            draft.hasAutoPreviewTriggered = false;
            draft.lastAutoOpenCodeBlockLocation = {
              messageBlockIndex: chunkIndex,
              codeBlockIndex: codeIndex,
            };
            draft.isCanvasListOpen = false;
          });

          break messageBlockLoop;
        }
      }
    },
    [
      selectedCodeBlockLocation?.messageBlockIndex,
      selectedCodeBlockLocation?.codeBlockIndex,
      codeBlocksChunks,
      isCanvasOpen,
    ],
  );

  useEffect(
    function handleAutoPreview() {
      if (!codeBlocksChunks) return;

      const shouldTriggerAutoPreview =
        isCanvasOpen &&
        !hasAutoPreviewTriggered &&
        selectedCodeBlock &&
        !selectedCodeBlock.states.isInFlight &&
        selectedCodeBlockLocation != null &&
        selectedCodeBlock ===
          codeBlocksChunks[selectedCodeBlockLocation.messageBlockIndex]?.[
            selectedCodeBlockLocation.codeBlockIndex
          ];

      if (!shouldTriggerAutoPreview) return;

      canvasStore.setState((draft) => {
        draft.hasAutoPreviewTriggered = true;
      });

      canvasStore.setState((draft) => {
        draft.state = "preview";
      });
    },
    [
      selectedCodeBlock,
      isCanvasOpen,
      hasAutoPreviewTriggered,
      selectedCodeBlockLocation,
      codeBlocksChunks,
    ],
  );
}
