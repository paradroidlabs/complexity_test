import { LuDownload } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import {
  formatCanvasTitle,
  getCanvasTitle,
} from "@/plugins/canvas/canvas.types";
import { useCanvasStore } from "@/plugins/canvas/store";

export default function DownloadAsInteractiveHtml() {
  const { selectedCodeBlockLocation } = useCanvasStore();

  const selectedCodeBlock = useThreadCodeBlock({
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
  });

  return (
    <Tooltip
      content={t("plugin-canvas:canvas.tooltip.downloadAsInteractiveHtml")}
    >
      <Button
        variant="ghost"
        size="iconSm"
        onClick={async () => {
          if (
            !selectedCodeBlock?.content.code ||
            !selectedCodeBlock.content.language
          )
            return;

          const title =
            formatCanvasTitle(
              getCanvasTitle(selectedCodeBlock.content.language),
            ) || "mindmap";

          await sendMessage(
            "markmapRenderer:downloadAsInteractiveHtml",
            {
              content: selectedCodeBlock.content.code,
              title,
            },
            "window",
          );
        }}
      >
        <LuDownload className="x:size-4" />
      </Button>
    </Tooltip>
  );
}
