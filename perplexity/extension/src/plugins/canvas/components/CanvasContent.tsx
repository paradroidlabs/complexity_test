import { Tabs, TabsContent } from "@/components/ui/tabs";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import type { CanvasLanguage } from "@/plugins/canvas/canvas.types";
import { getInterpretedCanvasLanguage } from "@/plugins/canvas/canvas.types";
import { CANVAS_INITIAL_STATE } from "@/plugins/canvas/canvases";
import CanvasCodeView from "@/plugins/canvas/components/CodeView";
import CanvasPreview from "@/plugins/canvas/components/Preview";
import { useCanvasStore } from "@/plugins/canvas/store";
import { PPLX_SCROLLBAR_CLASSES } from "@/utils/pplx-scrollbar-classes";

export default function CanvasContent() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const isInFlight = selectedCodeBlock?.states.isInFlight;
  const canvasViewMode = useCanvasStore((state) => state.state);
  const language = getInterpretedCanvasLanguage(
    selectedCodeBlock?.content.language ?? "text",
  ) as CanvasLanguage;
  const previewKey = useCanvasStore((state) => state.refreshPreviewKey);
  const isValidCanvasCode = useCanvasStore((state) => state.isValidCanvasCode);

  if (!isValidCanvasCode) return null;

  return (
    <Tabs
      lazyMount
      value={
        isInFlight && CANVAS_INITIAL_STATE[language] === "code"
          ? "code"
          : canvasViewMode
      }
      className={cn(PPLX_SCROLLBAR_CLASSES, "x:size-full x:overflow-auto")}
    >
      <TabsContent value="code" className="x:size-full">
        <CanvasCodeView />
      </TabsContent>
      <TabsContent
        value="preview"
        className={cn("x:size-full", {
          "x:hidden":
            isInFlight && CANVAS_INITIAL_STATE[language] !== "preview",
        })}
      >
        <CanvasPreview key={`${previewKey}`} language={language} />
      </TabsContent>
    </Tabs>
  );
}
