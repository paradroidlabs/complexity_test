import { type HTMLAttributes } from "react";

type SeparatorProps = HTMLAttributes<HTMLDivElement> & {
  orientation?: "horizontal" | "vertical";
};

const Separator = ({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorProps) => {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "x:shrink-0 x:bg-border",
        orientation === "horizontal"
          ? "x:h-[1px] x:w-full"
          : "x:h-full x:w-[1px]",
        className,
      )}
      {...props}
    />
  );
};

Separator.displayName = "Separator";

export { Separator };
