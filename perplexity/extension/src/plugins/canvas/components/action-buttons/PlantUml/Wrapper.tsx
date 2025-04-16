import { LuExternalLink } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useCanvasStore } from "@/plugins/canvas/store";
import { generatePlantUMLUrl } from "@/utils/plant-uml";

export default function PlantUmlCanvasActionButtonsWrapper() {
  const { selectedCodeBlockLocation } = useCanvasStore();

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  if (!selectedCodeBlock) return null;

  return (
    <Button
      variant="ghost"
      size="iconSm"
      onClick={() => {
        const code = selectedCodeBlock.content.code;
        if (!code) return;
        const url = generatePlantUMLUrl(code);
        if (!url) return;
        window.open(url, "_blank");
      }}
    >
      <LuExternalLink className="x:size-4" />
    </Button>
  );
}
