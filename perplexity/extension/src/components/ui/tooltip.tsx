import { Tooltip as ArkTooltip, Portal } from "@ark-ui/react";
import React, { use } from "react";

type TooltipContext = {
  positioning: ArkTooltip.RootProps["positioning"];
};

const TooltipContext = createContext<TooltipContext>({
  positioning: {
    placement: "top",
  },
});

const TooltipContextProvider = TooltipContext.Provider;

const TooltipRoot = ({ positioning, ...props }: ArkTooltip.RootProps) => {
  return (
    <TooltipContextProvider value={{ positioning }}>
      <ArkTooltip.Root
        unmountOnExit={false}
        lazyMount={true}
        positioning={positioning}
        {...props}
      />
    </TooltipContextProvider>
  );
};

const TooltipTrigger = ({ ...props }: ArkTooltip.TriggerProps) => {
  return (
    <ArkTooltip.Context>
      {({ setOpen }) => (
        <ArkTooltip.Trigger onTouchStart={() => setOpen(true)} {...props} />
      )}
    </ArkTooltip.Context>
  );
};

TooltipTrigger.displayName = "TooltipTrigger";

const TooltipContent = ({
  className,
  portal,
  ...props
}: ArkTooltip.ContentProps & {
  portal: boolean;
}) => {
  const { positioning } = use(TooltipContext);

  if (!positioning) {
    throw new Error("TooltipContent must be used within a TooltipContext");
  }

  const Comp = portal ? Portal : React.Fragment;

  return (
    <Comp>
      <ArkTooltip.Positioner>
        <ArkTooltip.Content
          className={cn(
            "x:z-50 x:max-w-[400px] x:overflow-hidden x:rounded-sm x:bg-foreground x:px-2 x:py-1 x:font-sans x:text-xs x:whitespace-pre-line x:text-popover x:shadow-md x:duration-150 x:dark:bg-primary-foreground x:dark:text-popover-foreground",
            "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
            "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
            "x:data-[state=closed]:zoom-out-95 x:data-[state=open]:zoom-in-95",
            "x:data-[side=bottom]:slide-in-from-top-1 x:data-[side=left]:slide-in-from-right-1",
            "x:data-[side=right]:slide-in-from-left-1 x:data-[side=top]:slide-in-from-bottom-1",
            className,
          )}
          data-side={positioning.placement}
          {...props}
        />
      </ArkTooltip.Positioner>
    </Comp>
  );
};

TooltipContent.displayName = "TooltipContent";

export { TooltipRoot, TooltipTrigger, TooltipContent };
