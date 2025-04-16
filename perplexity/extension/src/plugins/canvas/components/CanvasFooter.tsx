import CopyButton from "@/components/CopyButton";
import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import type { CanvasLanguage } from "@/plugins/canvas/canvas.types";
import { getInterpretedCanvasLanguage } from "@/plugins/canvas/canvas.types";
import { CANVAS_LANGUAGE_ACTION_BUTTONS } from "@/plugins/canvas/canvases";
import AutonomousCanvasVersionsNavigator from "@/plugins/canvas/components/VersionsNavigator";
import { useCanvasStore } from "@/plugins/canvas/store";

export default function CanvasFooter() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const language = getInterpretedCanvasLanguage(
    selectedCodeBlock?.content.language ?? "text",
  ) as CanvasLanguage;

  return (
    <div className="x:flex x:w-full x:items-center x:justify-between x:border-t x:border-border/50 x:bg-background x:p-2 x:px-4">
      <AutonomousCanvasVersionsNavigator />
      <div className="x:ml-auto x:flex x:items-center x:gap-1">
        {CANVAS_LANGUAGE_ACTION_BUTTONS[language] &&
          (() => {
            const ActionButtons = CANVAS_LANGUAGE_ACTION_BUTTONS[language];
            return <ActionButtons />;
          })()}
        <Button
          asChild
          className="x:group x:animate-in x:fade-in"
          variant="ghost"
          size="iconSm"
        >
          <CopyButton
            content={selectedCodeBlock?.content.code ?? ""}
            className="x:group-hover:text-primary"
          />
        </Button>
      </div>
    </div>
  );
}
