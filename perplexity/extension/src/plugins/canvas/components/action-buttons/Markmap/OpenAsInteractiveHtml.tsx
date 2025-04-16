import { LuExternalLink } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useCanvasStore } from "@/plugins/canvas/store";

export default function OpenAsInteractiveHtml() {
  const { selectedCodeBlockLocation } = useCanvasStore();

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  if (!selectedCodeBlock) return null;

  return (
    <Tooltip content={t("plugin-canvas:canvas.tooltip.viewAsInteractiveHtml")}>
      <Button
        variant="ghost"
        size="iconSm"
        onClick={async () => {
          if (!selectedCodeBlock.content.code) return;

          await sendMessage(
            "markmapRenderer:openAsInteractiveHtml",
            {
              content: selectedCodeBlock.content.code,
            },
            "window",
          );
        }}
      >
        <LuExternalLink className="x:size-4" />
      </Button>
    </Tooltip>
  );
}
