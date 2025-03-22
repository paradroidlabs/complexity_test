import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";

export function useObserveStuckToolbar() {
  const { isMobile } = useIsMobileStore();

  const shouldObserve =
    ExtensionLocalStorageService.getCachedSync()?.plugins[
      "thread:betterMessageToolbars"
    ].sticky;

  const observerRef = useRef<IntersectionObserver | null>(null);

  const navbarHeightStr =
    document.body.style.getPropertyValue("--navbar-height");
  const navbarHeight = navbarHeightStr ? +navbarHeightStr : 53;

  const toolbars = useThreadMessageBlocksDomObserverStore(
    (store) => store.messageBlocks?.map((block) => block.nodes.$bottomBar[0]),
    deepEqual,
  );

  useEffect(() => {
    if (!shouldObserve || navbarHeight == null || !toolbars) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const $toolbar = $(entry.target);
          $toolbar.toggleClass("stuck", !entry.isIntersecting);
        });
      },
      {
        threshold: 1.0,
        rootMargin: `-${navbarHeight + 10}px 0px 0px 0px`,
      },
    );

    observerRef.current = observer;

    toolbars
      .filter((toolbar) => toolbar != null)
      .forEach((toolbar) => observer.observe(toolbar));

    return () => observer.disconnect();
  }, [isMobile, navbarHeight, shouldObserve, toolbars]);
}
