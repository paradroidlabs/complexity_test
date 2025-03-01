import { LuX } from "react-icons/lu";

import { useIsMobileStore } from "@/hooks/use-is-mobile-store";
import FloatingToggle from "@/plugins/thread-toc/FloatingToggle";
import { usePanelPosition } from "@/plugins/thread-toc/usePanelPosition";
import { useThreadTocItems } from "@/plugins/thread-toc/useThreadTocItems";
import { scrollToElement } from "@/utils/utils";

export const PANEL_WIDTH = 200;

type TocItem = {
  id: string;
  title: string;
  isActive?: boolean;
};

export default function ThreadTocWrapper() {
  const { isMobile } = useIsMobileStore();

  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const tocItems = useThreadTocItems();
  const { position, isFloating } = usePanelPosition() ?? {};
  const { top, left } = position ?? {};

  const handleToggleOpen = useCallback(() => setIsOpen(true), []);
  const handleToggleClose = useCallback(() => setIsOpen(false), []);

  const panelStyles = useMemo(
    () => ({
      ["--panel-width"]: `${PANEL_WIDTH}px`,
      ["--panel-top"]: top != null ? `${top}px` : undefined,
      ["--panel-left"]: !isFloating && left != null ? `${left}px` : undefined,
    }),
    [top, left, isFloating],
  ) as React.CSSProperties;

  const shouldShowToc = tocItems.length > 1 && !!position;

  useEffect(() => {
    if (!isMobile) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, isOpen]);

  if (!shouldShowToc) return null;

  return (
    <>
      {isFloating && (
        <FloatingToggle isOpen={isOpen} onClick={handleToggleOpen} />
      )}
      <div
        ref={containerRef}
        className={cn(
          "x-custom-scrollbar x-fixed x-top-[--panel-top]",
          "x-w-[--panel-width] x-overflow-y-auto",
          {
            "x-max-h-[60vh]": isFloating,
            "x-max-h-[80vh]": !isFloating,
          },
          "x-transition-all x-animate-in x-fade-in",
          {
            "x-left-[--panel-left]": !isFloating,
            "x-right-3 x-rounded-md x-border x-border-border/50 x-bg-secondary x-p-4 x-shadow-lg md:x-right-8":
              isFloating,
            "x-hidden": isFloating && !isOpen,
          },
        )}
        style={panelStyles}
      >
        {isFloating && <CloseButton onClick={handleToggleClose} />}
        <div className="x-flex x-flex-col x-gap-2">
          {tocItems.map((item, idx) => (
            <TocItem
              key={idx}
              item={item}
              onClick={() => {
                const $element = $(`#${item.id}`);
                if ($element.length) scrollToElement($element, 0, 300);
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}

const TocItem = memo(function TocItem({
  item,
  onClick,
}: {
  item: TocItem;
  onClick: () => void;
}) {
  const title = useMemo(() => {
    return (
      item.title.trim().slice(0, 300) + (item.title.length > 300 ? "..." : "")
    );
  }, [item.title]);

  return (
    <div
      className="x-flex x-cursor-pointer x-gap-4"
      title={title}
      onClick={onClick}
    >
      <div
        className={cn("x-min-h-5 x-min-w-[2px] x-rounded-full", {
          "x-bg-foreground": item.isActive,
          "x-bg-muted-foreground": !item.isActive,
        })}
      />
      <div
        className={cn("x-line-clamp-2 x-text-sm x-transition-colors", {
          "x-font-medium x-text-foreground": item.isActive,
          "x-text-muted-foreground hover:x-text-foreground": !item.isActive,
        })}
      >
        {title}
      </div>
    </div>
  );
});

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="x-absolute x-right-2 x-top-2 x-cursor-pointer x-rounded-full x-p-1 x-text-muted-foreground x-transition-colors hover:x-text-foreground"
      onClick={onClick}
    >
      <LuX className="x-size-4" />
    </div>
  );
}
