import { CANVAS_RENDERER } from "@/plugins/canvas/canvases";
import type { CanvasLanguage } from "@/plugins/canvas/types";

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
