import { LuExternalLink } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useCanvasStore } from "@/plugins/canvas/store";

export default function MermaidOpenInPlayground() {
  const { selectedCodeBlockLocation } = useCanvasStore();

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  if (!selectedCodeBlock) return null;

  return (
    <Tooltip content={t("plugin-canvas:canvas.tooltip.openInMermaid")}>
      <Button
        variant="ghost"
        size="iconSm"
        onClick={async () => {
          if (!selectedCodeBlock.content.code) return;

          const url = await sendMessage(
            "mermaidRenderer:getPlaygroundUrl",
            {
              code: selectedCodeBlock.content.code,
            },
            "window",
          );

          if (!url) {
            return toast({
              title: t("plugin-canvas:canvas.error.previewUrl"),
            });
          }

          window.open(url, "_blank");
        }}
      >
        <LuExternalLink className="x:size-4" />
      </Button>
    </Tooltip>
  );
}
