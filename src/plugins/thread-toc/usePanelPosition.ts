import { useWindowSize } from "@uidotdev/usehooks";
import debounce from "lodash/debounce";

import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { PANEL_WIDTH } from "@/plugins/thread-toc";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { UiUtils } from "@/utils/ui-utils";

type UsePanelPosition = {
  position: { top: number; left: number };
  isFloating: boolean;
};

export function usePanelPosition(): UsePanelPosition | null {
  const { isMobile } = useIsMobileStore();
  const windowSize = useWindowSize();
  const [panelPosition, setPanelPosition] = useState<UsePanelPosition | null>(
    null,
  );
  const threadWrapper = useThreadDomObserverStore(
    (state) => state.$wrapper?.[0],
  );

  const calculatePosition = useCallback(() => {
    if (threadWrapper == null) return null;

    const $threadWrapper = $(threadWrapper);
    const $children = $threadWrapper.children();

    const $firstChild = $children.first();
    const threadWrapperOffset = $firstChild.offset();
    if (!threadWrapperOffset) return null;

    const stickyHeaderHeight = UiUtils.getStickyNavbar().height();
    if (stickyHeaderHeight == null) return null;

    let threadWrapperWidth = 0;
    $children.each((_, child) => {
      if (child.classList.contains("fixed")) return;
      const width = $(child).width();
      if (width != null) threadWrapperWidth += width;
    });
    if (threadWrapperWidth === 0) return null;

    const { left } = threadWrapperOffset;

    if (left <= 0) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
      }, 0);
      return;
    }

    const panelRightEdge = left + threadWrapperWidth + PANEL_WIDTH + 32;

    return {
      position: {
        top: stickyHeaderHeight + 40,
        left: threadWrapperWidth + left,
      },
      isFloating: panelRightEdge > window.innerWidth,
    };
  }, [threadWrapper]);

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      const newPanelPosition = calculatePosition();
      if (newPanelPosition == null) return;
      setPanelPosition(newPanelPosition);
    }, 100);

    debouncedUpdate();

    DomObserver.create("thread:tocSidebarObserver", {
      target: $(DOM_SELECTORS.SIDEBAR.WRAPPER)[0],
      config: {
        attributes: true,
        attributeFilter: ["class"],
      },
      onMutation: () =>
        CallbackQueue.getInstance().enqueue(
          debouncedUpdate,
          "thread:tocSidebarObserver",
        ),
    });

    return () => {
      debouncedUpdate.cancel();
      DomObserver.destroy("thread:tocSidebarObserver");
    };
  }, [calculatePosition, isMobile, windowSize]);

  return panelPosition;
}
