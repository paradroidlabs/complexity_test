import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import styles from "@/plugins/canvas/canvas.css?inline";
import CanvasContent from "@/plugins/canvas/components/CanvasContent";
import CanvasFooter from "@/plugins/canvas/components/CanvasFooter";
import CanvasHeader from "@/plugins/canvas/components/CanvasHeader";
import CanvasList from "@/plugins/canvas/components/CanvasList";
import { useCanvasStore } from "@/plugins/canvas/store";
import useHandleAutonomousCanvasState from "@/plugins/canvas/useHandleAutonomousCanvasState";
import { useHandleCanvasState } from "@/plugins/canvas/useHandleCanvasState";

export default function CanvasWrapper() {
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
  const isCanvasOpen = selectedCodeBlockLocation !== null;
  const isCanvasListOpen = useCanvasStore((state) => state.isCanvasListOpen);

  useInsertCss({
    id: "canvas",
    css: styles,
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

  if (!isCanvasOpen && !isCanvasListOpen) return null;

  if (!threadWrapper) return null;

  return (
    <Portal container={threadWrapper}>
      <div
        className={cn(
          "x-fixed x-right-8 x-my-8 x-h-[calc(100dvh-var(--navbar-height)-11rem)] x-overflow-hidden x-rounded-md x-border x-border-border/50 x-bg-secondary x-text-sm x-transition-all x-animate-in x-fade-in x-slide-in-from-right",
          "xl:x-sticky xl:x-top-6 xl:x-my-0 xl:x-mt-6 xl:x-h-[calc(100dvh-var(--navbar-height)-4rem)]",
          {
            "x-w-[75vw] xl:x-w-[200%]": isCanvasOpen,
            "x-w-[30vw] xl:x-w-[20%] xl:x-min-w-[400px]": isCanvasListOpen,
          },
        )}
      >
        {isCanvasListOpen && <CanvasList />}
        {isCanvasOpen && selectedCodeBlock != null && (
          <div className="x-flex x-size-full x-flex-col">
            <CanvasHeader />
            <CanvasContent />
            <CanvasFooter />
          </div>
        )}
      </div>
    </Portal>
  );
}
