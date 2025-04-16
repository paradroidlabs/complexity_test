import { useThreadCodeBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/code-blocks/store";
import {
  isAutonomousCanvasLanguageString,
  isCanvasLanguageString,
} from "@/plugins/canvas/canvas.types";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";

export function useHandleCanvasState() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const codeBlocksChunks = useThreadCodeBlocksDomObserverStore(
    (store) => store.codeBlocksChunks,
    deepEqual,
  );

  useEffect(
    function handleCanvasOpenStateChange() {
      if (!codeBlocksChunks) return;

      if (!selectedCodeBlockLocation) {
        canvasStore.setState((draft) => {
          draft.isValidCanvasCode = false;
        });
        return;
      }

      const { messageBlockIndex, codeBlockIndex } = selectedCodeBlockLocation;
      const messageBlocks = codeBlocksChunks[messageBlockIndex];
      const codeBlock = messageBlocks?.[codeBlockIndex];

      const isValidCanvasCode =
        codeBlock?.content.code != null &&
        codeBlock?.content.language != null &&
        (isCanvasLanguageString(codeBlock.content.language) ||
          isAutonomousCanvasLanguageString(codeBlock.content.language));

      canvasStore.setState((draft) => {
        draft.isValidCanvasCode = isValidCanvasCode;
      });
    },
    [codeBlocksChunks, selectedCodeBlockLocation],
  );

  useEffect(
    function handleCanvasClose() {
      if (!selectedCodeBlockLocation || !codeBlocksChunks) return;

      const { messageBlockIndex, codeBlockIndex } = selectedCodeBlockLocation;
      const codeBlockExists =
        codeBlocksChunks[messageBlockIndex]?.[codeBlockIndex] != null;

      if (!codeBlockExists) {
        canvasStore.getState().close();
      }
    },
    [selectedCodeBlockLocation, codeBlocksChunks],
  );
}
