import { useDebounce, useLocalStorage } from "@uidotdev/usehooks";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import { useSidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";

export default function SidebarToggleableRecentThreadsToggleButton() {
  const isMobile = useDebounce(
    useIsMobileStore((state) => state.isMobile),
    1000,
  );

  const $libraryButtonWrapper = useSidebarDomObserverStore(
    (store) => store.$libraryButtonWrapper,
    deepEqual,
  );

  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    "cplx.sidebar-recent-threads-collapsed",
    false,
  );

  useEffect(() => {
    if (!$libraryButtonWrapper) return;

    $libraryButtonWrapper
      .find(".group\\/history")
      .toggleClass("x:hidden", isCollapsed);
  }, [$libraryButtonWrapper, isCollapsed, isMobile]);

  return (
    <Tooltip content={isCollapsed ? t("misc.expand") : t("misc.collapse")}>
      <div
        className="x:invisible x:flex x:size-6 x:items-center x:justify-center x:text-foreground x:opacity-0 x:transition-all x:group-hover:visible x:group-hover:opacity-100 x:hover:bg-black/5 x:dark:hover:bg-white/5"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsCollapsed((prev) => !prev);
        }}
      >
        {isCollapsed ? <LuChevronDown /> : <LuChevronUp />}
      </div>
    </Tooltip>
  );
}
