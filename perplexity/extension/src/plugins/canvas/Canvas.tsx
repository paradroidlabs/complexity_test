import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import CanvasContent from "@/plugins/canvas/components/CanvasContent";
import CanvasFooter from "@/plugins/canvas/components/CanvasFooter";
import CanvasHeader from "@/plugins/canvas/components/CanvasHeader";
import CanvasList from "@/plugins/canvas/components/CanvasList";
import { canvasCssResourceConfig } from "@/plugins/canvas/index.remote-resources";
import { useCanvasStore } from "@/plugins/canvas/store";
import useHandleAutonomousCanvasState from "@/plugins/canvas/useHandleAutonomousCanvasState";
import { useHandleCanvasState } from "@/plugins/canvas/useHandleCanvasState";
import { getVersionedRemoteResource } from "@/services/cplx-api/versioned-remote-resources/utils";

const canvasCss = await getVersionedRemoteResource(canvasCssResourceConfig);

export function Canvas() {
  const threadWrapper = useThreadDomObserverStore(
    (state) => state.$wrapper?.[0],
    deepEqual,
  );

  useHandleCanvasState();
  useHandleAutonomousCanvasState();

  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });
  const isCanvasOpen = selectedCodeBlockLocation != null;
  const isCanvasListOpen = useCanvasStore((state) => state.isCanvasListOpen);

  useInsertCss({
    id: "canvas",
    css: canvasCss,
    inject: isCanvasOpen || isCanvasListOpen,
  });

  useEffect(() => {
    if (!isCanvasOpen && !isCanvasListOpen) {
      $(document.body).removeAttr("data-cplx-canvas-active-panel");
      return;
    }

    $(document.body).attr(
      "data-cplx-canvas-active-panel",
      isCanvasListOpen ? "list" : "canvas",
    );
  }, [isCanvasOpen, isCanvasListOpen]);

  if (!threadWrapper || (!isCanvasOpen && !isCanvasListOpen)) return null;

  return (
    <Portal container={threadWrapper}>
      <div
        id="cplx-canvas"
        data-open={isCanvasOpen}
        className={cn(
          "x:fixed x:right-8 x:z-10 x:my-8 x:overflow-hidden x:border x:border-border/50 x:bg-secondary x:text-sm x:transition-all x:animate-in x:fade-in x:slide-in-from-right",
          "x:top-(--header-height) x:xl:sticky x:xl:right-0 x:xl:m-0 x:xl:my-0",
        )}
      >
        {isCanvasListOpen && <CanvasList />}
        {isCanvasOpen && selectedCodeBlock != null && (
          <div className="x:flex x:size-full x:flex-col">
            <CanvasHeader />
            <CanvasContent />
            <CanvasFooter />
          </div>
        )}
      </div>
    </Portal>
  );
}
