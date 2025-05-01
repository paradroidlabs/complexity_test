import { LuPlay } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import { canvasStore } from "@/plugins/canvas/index.public";
import {
  isAutonomousCanvasLanguageString,
  isCanvasLanguageString,
} from "@/plugins/canvas/index.public";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

export default function CanvasSimpleModeRenderButton() {
  const { codeBlock, sourceCodeBlockIndex, sourceMessageBlockIndex } =
    useMirroredCodeBlockContext();

  if (!codeBlock) return null;

  const language = codeBlock.content.language;

  if (
    !isCanvasLanguageString(language) &&
    !isAutonomousCanvasLanguageString(language)
  )
    return null;

  return (
    <CsUiPluginsGuard desktopOnly dependentPluginIds={["thread:canvas"]}>
      <Tooltip content="Render in Canvas">
        <div
          className="x:cursor-pointer x:text-muted-foreground x:transition-colors x:hover:text-foreground"
          onClick={() => {
            canvasStore.setState((draft) => {
              draft.selectedCodeBlockLocation = {
                messageBlockIndex: sourceMessageBlockIndex,
                codeBlockIndex: sourceCodeBlockIndex,
              };
              draft.state = "preview";
            });
          }}
        >
          <LuPlay className="x:size-4" />
        </div>
      </Tooltip>
    </CsUiPluginsGuard>
  );
}
