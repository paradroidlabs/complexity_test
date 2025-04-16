import { Popover as ArkPopover, Portal } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import type { RefObject } from "react";

import { untrapWheel } from "@/utils/utils";

const PopoverRootProvider = ArkPopover.RootProvider;

function Popover({ ...props }: ArkPopover.RootProps) {
  return <ArkPopover.Root unmountOnExit={true} lazyMount={true} {...props} />;
}

Popover.displayName = "Popover";

const PopoverTrigger = ({ ...props }: ArkPopover.TriggerProps) => {
  return <ArkPopover.Trigger {...props} />;
};

PopoverTrigger.displayName = "PopoverTrigger";

const PopoverContent = ({
  className,
  portal = true,
  ref,
  ...props
}: ArkPopover.ContentProps & {
  ref?: RefObject<HTMLDivElement | null>;
  portal?: boolean;
}) => {
  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkPopover.Positioner>
        <ArkPopover.Content
          ref={ref}
          className={cn(
            "x:z-10 x:w-max x:rounded-xl x:border x:border-border/50 x:bg-popover x:p-4 x:text-popover-foreground x:shadow-md x:focus-visible:outline-none",
            "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
            "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
            "x:data-[state=closed]:zoom-out-95 x:data-[state=open]:zoom-in-95",
            "x:data-[side=bottom]:slide-in-from-top-2 x:data-[side=left]:slide-in-from-right-2",
            "x:data-[side=right]:slide-in-from-left-2 x:data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          onWheel={untrapWheel}
          {...props}
        />
      </ArkPopover.Positioner>
    </Comp>
  );
};

PopoverContent.displayName = "PopoverContent";

const PopoverContext = ArkPopover.Context;

export {
  PopoverRootProvider,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverContext,
};
