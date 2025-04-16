import { HoverCard as ArkHoverCard, Portal } from "@ark-ui/react";
import { Slot } from "@radix-ui/react-slot";
import { createContext, use } from "react";

const HoverCardRootProvider = ArkHoverCard.RootProvider;

type HoverCardLocalContext = {
  portal: boolean;
};

const HoverCardLocalContext = createContext<HoverCardLocalContext>({
  portal: true,
});

const HoverCardLocalContextProvider = HoverCardLocalContext.Provider;

function HoverCard({
  portal,
  ...props
}: ArkHoverCard.RootProps & {
  portal?: boolean;
}) {
  return (
    <HoverCardLocalContextProvider
      value={{
        portal: portal ?? true,
      }}
    >
      <ArkHoverCard.Root unmountOnExit={true} lazyMount={true} {...props} />
    </HoverCardLocalContextProvider>
  );
}

HoverCard.displayName = "HoverCard";

const HoverCardTrigger = ({ ...props }: ArkHoverCard.TriggerProps) => {
  return <ArkHoverCard.Trigger {...props} />;
};

HoverCardTrigger.displayName = "HoverCardTrigger";

const HoverCardContent = ({
  className,
  ...props
}: ArkHoverCard.ContentProps) => {
  const { portal } = use(HoverCardLocalContext);

  if (typeof portal === "undefined") {
    throw new Error("HoverCardContent must be a child of HoverCard");
  }

  const Comp = portal ? Portal : Slot;

  return (
    <Comp>
      <ArkHoverCard.Positioner>
        <ArkHoverCard.Content
          className={cn(
            "x:bg-hoverCard x:text-hoverCard-foreground x:z-50 x:w-max x:rounded-md x:border x:border-border/50 x:bg-popover x:p-4 x:shadow-md x:focus-visible:outline-none",
            "x:data-[state=closed]:animate-out x:data-[state=open]:animate-in",
            "x:data-[state=closed]:fade-out-0 x:data-[state=open]:fade-in-0",
            "x:data-[state=closed]:zoom-out-95 x:data-[state=open]:zoom-in-95",
            "x:data-[side=bottom]:slide-in-from-top-2 x:data-[side=left]:slide-in-from-right-2",
            "x:data-[side=right]:slide-in-from-left-2 x:data-[side=top]:slide-in-from-bottom-2",
            className,
          )}
          {...props}
        />
      </ArkHoverCard.Positioner>
    </Comp>
  );
};

HoverCardContent.displayName = "HoverCardContent";

const HoverCardContext = ArkHoverCard.Context;

export {
  HoverCard,
  HoverCardRootProvider,
  HoverCardTrigger,
  HoverCardContent,
  HoverCardContext,
};
