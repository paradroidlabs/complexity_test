import type { CanvasLanguage } from "@/plugins/canvas/canvas.types";
import { CANVAS_RENDERER } from "@/plugins/canvas/canvases";

export default function CanvasPreview({
  language,
}: {
  language: CanvasLanguage;
}) {
  const Component = CANVAS_RENDERER[language];

  if (Component == null) return null;

  return (
    <div className="x:size-full">
      <Component />
    </div>
  );
}
