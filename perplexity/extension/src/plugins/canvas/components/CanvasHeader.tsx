import { LuList, LuRefreshCcw, LuX } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import type { CanvasLanguage } from "@/plugins/canvas/canvas.types";
import PreviewToggle from "@/plugins/canvas/components/PreviewToggle";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";
import {
  formatCanvasTitle,
  getCanvasTitle,
  getInterpretedCanvasLanguage,
  isAutonomousCanvasLanguageString,
  isCanvasLanguageString,
} from "@/plugins/canvas/utils";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";
import { scrollToElement } from "@/utils/utils";

export default function CanvasHeader() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const title = formatCanvasTitle(
    getCanvasTitle(selectedCodeBlock?.content.language),
  );
  const isCanvasLanguage = isCanvasLanguageString(
    selectedCodeBlock?.content.language,
  );
  const isAutonomousCanvasLanguage = isAutonomousCanvasLanguageString(
    selectedCodeBlock?.content.language,
  );
  const isInFlight = selectedCodeBlock?.states.isInFlight;
  const canvasViewMode = useCanvasStore((state) => state.state);
  const language = getInterpretedCanvasLanguage(
    selectedCodeBlock?.content.language ?? "text",
  ) as CanvasLanguage;

  if (!isCanvasLanguage && !isAutonomousCanvasLanguage) return null;

  return (
    <div className="x:flex x:w-full x:items-center x:justify-between x:border-b x:border-border/50 x:bg-background x:p-2 x:px-4">
      <div
        className="x:line-clamp-1 x:cursor-pointer x:text-muted-foreground"
        onClick={() => {
          const selectedCodeBlockLocation =
            canvasStore.getState().selectedCodeBlockLocation;
          if (!selectedCodeBlockLocation) return;

          const selector = `[data-cplx-component="${DomSelectorsService.internalAttributes.THREAD.MESSAGE.BLOCK}"][data-index="${selectedCodeBlockLocation.messageBlockIndex}"] [data-cplx-component="${DomSelectorsService.internalAttributes.THREAD.MESSAGE.MIRRORED_CODE_BLOCK}"][data-index="${selectedCodeBlockLocation.codeBlockIndex}"]`;

          scrollToElement($(selector), -100);
        }}
      >
        {title}
      </div>
      <div className="x:flex x:items-center x:gap-1">
        <div
          className={cn("x:flex x:items-center x:gap-1", {
            "x:invisible": isInFlight,
          })}
        >
          {canvasViewMode === "preview" && (
            <Tooltip content={t("plugin-canvas:canvas.tooltip.refresh")}>
              <Button
                variant="ghost"
                size="iconSm"
                className="x:animate-in x:fade-in"
                onClick={() => canvasStore.getState().refreshPreview()}
              >
                <LuRefreshCcw className="x:size-4" />
              </Button>
            </Tooltip>
          )}
          {isAutonomousCanvasLanguage && (
            <>
              <PreviewToggle language={language} />
              {isAutonomousCanvasLanguage && (
                <Tooltip content={t("plugin-canvas:canvas.tooltip.openList")}>
                  <Button
                    variant="ghost"
                    size="iconSm"
                    onClick={() => canvasStore.getState().openCanvasList()}
                  >
                    <LuList className="x:size-4" />
                  </Button>
                </Tooltip>
              )}
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => canvasStore.getState().close()}
        >
          <LuX className="x:size-4" />
        </Button>
      </div>
    </div>
  );
}
