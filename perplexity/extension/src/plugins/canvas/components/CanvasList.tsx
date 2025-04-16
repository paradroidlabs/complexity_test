import { LuLoaderCircle, LuX } from "react-icons/lu";

import { Button } from "@/components/ui/button";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";

export default function CanvasList() {
  const canvasBlocks = useCanvasStore((state) => state.canvasBlocks);

  return (
    <div className="x:flex x:size-full x:flex-col x:gap-4">
      <div className="x:flex x:items-center x:justify-between x:border-b x:border-border/50 x:bg-background x:p-2 x:px-4">
        <div className="x:text-muted-foreground">
          {t("plugin-canvas:canvas.list.title")}
        </div>
        <Button
          variant="ghost"
          size="iconSm"
          onClick={() => {
            canvasStore.getState().closeCanvasList();
          }}
        >
          <LuX className="x:size-4 x:text-muted-foreground" />
        </Button>
      </div>
      <div className="x:flex x:flex-col x:gap-4 x:overflow-y-auto x:px-4">
        {Object.values(canvasBlocks).map(
          ({ Icon, count, title, description, isInFlight, onClick }, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "x:group x:flex x:w-full x:cursor-pointer x:items-center x:overflow-hidden x:rounded-lg x:border x:border-border/50 x:bg-secondary x:transition-all x:select-none x:hover:border-primary",
                )}
                onClick={onClick}
              >
                <div
                  className={cn(
                    "x:flex x:aspect-square x:size-16 x:items-center x:justify-center x:group-hover:bg-primary/10",
                  )}
                >
                  {isInFlight ? (
                    <LuLoaderCircle className="x:size-4 x:animate-spin x:text-muted-foreground" />
                  ) : (
                    <Icon className="x:size-8" />
                  )}
                </div>
                <div className="x:flex x:w-full x:flex-col x:bg-background x:px-4 x:py-2">
                  <div className="x:line-clamp-1 x:text-base x:text-foreground x:transition-all x:group-hover:text-primary">
                    {title}
                  </div>

                  <div className="x:flex x:w-max x:items-center x:gap-1">
                    {isInFlight ? (
                      <span className="x:animate-pulse">
                        {t("plugin-canvas:canvas.list.generating")}
                      </span>
                    ) : (
                      <>
                        <span className="x:hidden x:text-sm x:text-muted-foreground x:lg:block">
                          {description}
                        </span>
                        {count > 1 && (
                          <span className="x:flex x:items-center x:gap-1 x:text-sm x:text-muted-foreground">
                            <span className="x:hidden x:lg:block">•</span>
                            {t("plugin-canvas:canvas.list.versions", { count })}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          },
        )}
      </div>
    </div>
  );
}
