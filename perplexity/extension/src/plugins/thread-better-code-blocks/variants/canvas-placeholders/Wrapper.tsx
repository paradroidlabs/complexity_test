import { LuLoaderCircle } from "react-icons/lu";

import type { CanvasLanguage } from "@/plugins/canvas/index.public";
import { CANVAS_PLACEHOLDERS } from "@/plugins/canvas/index.public";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/index.public";
import {
  formatCanvasTitle,
  getCanvasTitle,
  getInterpretedCanvasLanguage,
} from "@/plugins/canvas/index.public";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

const CanvasPlaceholderWrapper = memo(function CanvasPlaceholderWrapper() {
  const { codeBlock, sourceMessageBlockIndex, sourceCodeBlockIndex } =
    useMirroredCodeBlockContext();

  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const isSelected =
    selectedCodeBlockLocation?.messageBlockIndex === sourceMessageBlockIndex &&
    selectedCodeBlockLocation?.codeBlockIndex === sourceCodeBlockIndex;

  const title = formatCanvasTitle(getCanvasTitle(codeBlock?.content.language));
  const interpretedLanguage = getInterpretedCanvasLanguage(
    codeBlock?.content.language ?? "",
  );

  const placeholderElements =
    CANVAS_PLACEHOLDERS[interpretedLanguage as CanvasLanguage];

  if (!placeholderElements) return null;

  return (
    <div
      className={cn(
        "x:group x:my-4 x:flex x:w-max x:cursor-pointer x:items-center x:overflow-hidden x:rounded-lg x:border x:bg-secondary x:transition-all x:select-none x:hover:border-primary",
        {
          "x:border-primary": isSelected,
        },
      )}
      onClick={() => {
        canvasStore.setState((draft) => {
          draft.selectedCodeBlockLocation = {
            messageBlockIndex: sourceMessageBlockIndex,
            codeBlockIndex: sourceCodeBlockIndex,
          };
          draft.state = "preview";
          draft.isCanvasListOpen = false;
        });
      }}
    >
      <div
        className={cn(
          "x:flex x:size-16 x:items-center x:justify-center x:group-hover:bg-primary/10",
          {
            "x:bg-primary/10": isSelected,
          },
        )}
      >
        {codeBlock?.states.isInFlight ? (
          <LuLoaderCircle className="x:size-4 x:animate-spin x:text-muted-foreground" />
        ) : (
          <placeholderElements.icon className="x:size-8" />
        )}
      </div>
      <div className="x:flex x:max-w-[300px] x:flex-col x:bg-background x:px-4 x:py-2">
        <div
          className={cn(
            "x:line-clamp-1 x:text-base x:text-foreground x:transition-all x:group-hover:text-primary",
            {
              "x:text-primary": isSelected,
            },
          )}
        >
          {title.length > 0 ? title : placeholderElements.defaultTitle}
        </div>
        <div className="x:w-max x:text-sm x:text-muted-foreground">
          {codeBlock?.states.isInFlight ? (
            <span className="x:animate-pulse">Generating...</span>
          ) : (
            placeholderElements.description
          )}
        </div>
      </div>
    </div>
  );
});

export default CanvasPlaceholderWrapper;
