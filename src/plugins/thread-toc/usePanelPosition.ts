import { useDebounce, useWindowSize } from "@uidotdev/usehooks";
import debounce from "lodash/debounce";

import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useThreadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { useSpaRouter } from "@/plugins/_core/spa-router/listeners";
import { PANEL_WIDTH } from "@/plugins/thread-toc";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

type UsePanelPosition = {
  position: { top: number; left: number };
  isOverflowing: boolean;
};

export function usePanelPosition(): UsePanelPosition | null {
  const { url } = useSpaRouter();
  const windowSize = useDebounce(useWindowSize(), 200);
  const [panelPosition, setPanelPosition] = useState<UsePanelPosition | null>(
    null,
  );
  const threadWrapper = useThreadDomObserverStore(
    (store) => store.$wrapper?.[0],
    deepEqual,
  );

  const threadContentWrapper = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.[0]?.nodes.$query[0],
    deepEqual,
  );

  const calculatePosition = useCallback(() => {
    if (threadWrapper == null || threadContentWrapper == null) return null;

    const $threadWrapper = $(threadWrapper);
    const $children = $threadWrapper.children();

    const $firstChild = $children.first();
    const threadWrapperOffset = $firstChild.offset();
    if (!threadWrapperOffset) return null;

    const navbarHeightStr =
      document.body.style.getPropertyValue("--navbar-height");
    const navbarHeight = navbarHeightStr ? parseInt(navbarHeightStr) : 53;

    let threadContentWrapperWidth = threadContentWrapper.offsetWidth ?? 0;

    const validChildren = $children.filter((index, child) => {
      return index > 0 && !child.classList.contains("fixed");
    });

    if (validChildren.length > 0) threadContentWrapperWidth += 32;

    validChildren.each((_, child) => {
      const width = $(child).width();
      if (width != null) threadContentWrapperWidth += width;
    });

    if (threadContentWrapperWidth === 0) return null;

    const threadContentWrapperOffset =
      threadContentWrapper.getBoundingClientRect();

    if (threadContentWrapperOffset == null) return null;

    const panelRightEdge =
      threadContentWrapperOffset.left +
      threadContentWrapperWidth +
      PANEL_WIDTH +
      32 +
      32;

    return {
      position: {
        top: navbarHeight + 40,
        left: threadContentWrapperWidth + threadContentWrapperOffset.left + 32,
      },
      isOverflowing: panelRightEdge > window.innerWidth,
    };
  }, [threadContentWrapper, threadWrapper]);

  useEffect(() => {
    const debouncedUpdate = debounce(() => {
      const newPanelPosition = calculatePosition();
      if (newPanelPosition == null) return;
      setPanelPosition(newPanelPosition);
    }, 100);

    debouncedUpdate();

    const $sidebarWrapper = $(DOM_SELECTORS.SIDEBAR.WRAPPER);

    if (!$sidebarWrapper[0]) return;

    DomObserver.create("thread:tocSidebarObserver", {
      target: $sidebarWrapper[0],
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
  }, [calculatePosition, windowSize, url]);

  return panelPosition;
}
