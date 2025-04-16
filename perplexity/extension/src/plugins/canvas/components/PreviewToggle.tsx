import type { CanvasLanguage } from "@/plugins/canvas/canvas.types";
import {
  CANVAS_LANGUAGE_PREVIEW_TOGGLE_TEXT,
  CANVAS_LANGUAGE_RAW_TOGGLE_TEXT,
} from "@/plugins/canvas/canvases";
import { useCanvasStore } from "@/plugins/canvas/store";

export default function PreviewToggle({
  language,
}: {
  language: CanvasLanguage;
}) {
  const { state, setState } = useCanvasStore();

  return (
    <div
      className="x:flex x:cursor-pointer x:items-center x:overflow-hidden x:rounded-md x:border x:border-border/50 x:bg-secondary x:animate-in x:select-none x:fade-in"
      onClick={() => setState(state === "code" ? "preview" : "code")}
    >
      <div
        className={cn("x:p-1 x:px-4 x:text-muted-foreground", {
          "x:rounded-md x:bg-primary x:text-primary-foreground x:transition-all":
            state === "preview",
        })}
      >
        {CANVAS_LANGUAGE_PREVIEW_TOGGLE_TEXT[language] ??
          t("plugin-canvas:canvas.toggle.preview")}
      </div>
      <div
        className={cn("x:p-1 x:px-4 x:text-muted-foreground", {
          "x:rounded-md x:bg-primary x:text-primary-foreground x:transition-all":
            state === "code",
        })}
      >
        {CANVAS_LANGUAGE_RAW_TOGGLE_TEXT[language] ??
          t("plugin-canvas:canvas.toggle.code")}
      </div>
    </div>
  );
}
