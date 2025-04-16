import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import type { ComponentProps } from "react";

const ScrollArea = ({
  className,
  children,
  type = "always",
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.Root>) => (
  <ScrollAreaPrimitive.Root
    type={type}
    className={cn("x:relative x:overflow-hidden", className)}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className="x:h-full x:w-full x:rounded-[inherit]">
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollBar orientation="horizontal" />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
);

ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = ({
  className,
  orientation = "vertical",
  ...props
}: ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    orientation={orientation}
    className={cn(
      "x:flex x:touch-none x:transition-colors x:select-none",
      orientation === "vertical" &&
        "x:h-full x:w-2.5 x:border-l x:border-l-transparent x:p-[1px]",
      orientation === "horizontal" &&
        "x:h-2.5 x:flex-col x:border-t x:border-t-transparent x:p-[1px]",
      className,
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="x:relative x:flex-1 x:rounded-full x:bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
);

ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
