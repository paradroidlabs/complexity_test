import { LuArrowLeft, LuArrowRight } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { getCanvasTitle } from "@/plugins/canvas/canvas.types";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";
import { scrollToElement } from "@/utils/utils";

export default function AutonomousCanvasVersionsNavigator() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const canvasBlocks = useCanvasStore((state) => state.canvasBlocks);
  const canvasTitle = getCanvasTitle(selectedCodeBlock?.content.language);

  const versions = canvasBlocks[canvasTitle];
  const currentLocationIndex = versions?.location.findIndex(
    (location) =>
      location.messageBlockIndex ===
        selectedCodeBlockLocation?.messageBlockIndex &&
      location.codeBlockIndex === selectedCodeBlockLocation?.codeBlockIndex,
  );
  const hasNextVersion =
    versions?.location &&
    currentLocationIndex !== versions?.location.length - 1;
  const hasPreviousVersion = versions?.location && currentLocationIndex !== 0;

  if (!versions || currentLocationIndex == null) return null;

  return (
    <div
      className={cn("x:flex x:items-center x:gap-1", {
        "x:invisible x:opacity-0": !hasNextVersion && !hasPreviousVersion,
      })}
    >
      <Button
        variant="ghost"
        size="iconSm"
        disabled={!hasPreviousVersion}
        onClick={() => {
          canvasStore.setState((draft) => {
            if (currentLocationIndex == null) return;
            const newLocation = versions?.location[currentLocationIndex - 1];
            if (!newLocation) return;
            draft.selectedCodeBlockLocation = newLocation;
          });
        }}
      >
        <LuArrowLeft className="x:size-4" />
      </Button>
      <div
        className="x:line-clamp-1 x:cursor-pointer x:text-sm x:text-muted-foreground"
        onClick={() => {
          const selectedCodeBlockLocation =
            canvasStore.getState().selectedCodeBlockLocation;
          if (!selectedCodeBlockLocation) return;

          const selector = `[data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.BLOCK}"][data-index="${selectedCodeBlockLocation.messageBlockIndex}"] [data-cplx-component="${INTERNAL_ATTRIBUTES.THREAD.MESSAGE.MIRRORED_CODE_BLOCK}"][data-index="${selectedCodeBlockLocation.codeBlockIndex}"]`;

          scrollToElement($(selector), -100);
        }}
      >
        {t("plugin-canvas:canvas.version", {
          number: currentLocationIndex + 1,
        })}
      </div>
      <Button
        variant="ghost"
        size="iconSm"
        disabled={!hasNextVersion}
        onClick={() => {
          canvasStore.setState((draft) => {
            if (currentLocationIndex == null) return;
            const newLocation = versions?.location[currentLocationIndex + 1];
            if (!newLocation) return;
            draft.selectedCodeBlockLocation = newLocation;
          });
        }}
      >
        <LuArrowRight className="x:size-4" />
      </Button>
    </div>
  );
}
