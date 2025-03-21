import { Menu, Portal } from "@ark-ui/react";
import { Fragment, type HTMLAttributes } from "react";
import { LuChevronRight as ChevronRight } from "react-icons/lu";

const DropdownMenuRootProvider = Menu.RootProvider;

function DropdownMenu({ ...props }: Menu.RootProps) {
  return <Menu.Root unmountOnExit={false} lazyMount={true} {...props} />;
}

const DropdownMenuContext = Menu.Context;

const DropdownMenuTrigger = ({ className, ...props }: Menu.TriggerProps) => (
  <Menu.Trigger className={cn(className)} {...props} />
);

DropdownMenuTrigger.displayName = "DropdownMenuTrigger";

const DropdownMenuContent = ({
  portal = true,
  className,
  ...props
}: Menu.ContentProps & { portal?: boolean }) => {
  const Comp = portal ? Portal : Fragment;

  return (
    <Comp>
      <Menu.Positioner>
        <Menu.Content
          className={cn(
            "x:z-50 x:min-w-[8rem] x:overflow-hidden x:rounded-xl x:border x:border-border/50 x:bg-popover x:p-2 x:text-popover-foreground x:shadow-md x:focus-visible:outline-none",
            "x:data-[state=open]:animate-in x:data-[state=open]:fade-in x:data-[state=open]:zoom-in-95",
            "x:data-[state=closed]:animate-out x:data-[state=closed]:fade-out x:data-[state=closed]:zoom-out-95",
            "x:data-[placement^=top]:slide-in-from-bottom-2",
            "x:data-[placement^=bottom]:slide-in-from-top-2",
            "x:data-[placement^=left]:slide-in-from-right-2",
            "x:data-[placement^=right]:slide-in-from-left-2",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Comp>
  );
};

DropdownMenuContent.displayName = "DropdownMenuContent";

const DropdownMenuItem = ({
  className,
  inset,
  ...props
}: Menu.ItemProps & { inset?: boolean }) => (
  <Menu.Item
    className={cn(
      "x:relative x:flex x:cursor-default x:items-center x:rounded-sm x:px-2 x:py-1.5 x:text-sm x:transition-colors x:outline-none x:select-none x:focus:bg-primary-foreground x:focus:text-primary x:data-[disabled]:pointer-events-none x:data-[disabled]:opacity-50 x:data-[highlighted]:bg-primary-foreground",
      inset && "x:pl-8",
      className,
    )}
    {...props}
  />
);

DropdownMenuItem.displayName = "DropdownMenuItem";

const DropdownMenuGroup = Menu.ItemGroup;

const DropdownMenuLabel = ({
  className,
  inset,
  ...props
}: Menu.ItemGroupLabelProps & { inset?: boolean }) => (
  <Menu.ItemGroupLabel
    className={cn(
      "x:px-2 x:py-1.5 x:text-xs x:text-muted-foreground",
      inset && "x:pl-8",
      className,
    )}
    {...props}
  />
);

DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = ({
  className,
  ...props
}: Menu.SeparatorProps) => (
  <Menu.Separator
    className={cn("x:-mx-1 x:my-1 x:h-px x:bg-muted", className)}
    {...props}
  />
);

DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

const DropdownMenuSub = ({ ...props }: Menu.RootProps) => (
  <Menu.Root
    unmountOnExit={false}
    lazyMount={true}
    positioning={{
      placement: "right-start",
      offset: {
        mainAxis: 15,
      },
    }}
    {...props}
  />
);

const DropdownMenuSubTrigger = ({
  className,
  children,
  ...props
}: Menu.TriggerItemProps) => (
  <Menu.TriggerItem
    className={cn(
      "x:relative x:flex x:cursor-default x:items-center x:justify-between x:rounded-sm x:px-2 x:py-1.5 x:text-sm x:transition-colors x:outline-none x:select-none x:focus:bg-primary-foreground x:focus:text-primary x:data-[disabled]:pointer-events-none x:data-[disabled]:opacity-50 x:data-[highlighted]:bg-primary-foreground x:data-[highlighted]:text-primary",
      className,
    )}
    {...props}
  >
    <div className="x:mr-2 x:flex x:items-center">{children}</div>
    <ChevronRight className="x:size-4" />
  </Menu.TriggerItem>
);
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

const DropdownMenuShortcut = ({
  ref,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  ref: React.RefObject<HTMLDivElement>;
}) => {
  return (
    <div
      ref={ref}
      className={cn(
        "x:ml-auto x:inline x:text-xs x:tracking-widest x:opacity-60",
        className,
      )}
      {...props}
    />
  );
};

DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

export {
  DropdownMenuRootProvider,
  DropdownMenu,
  DropdownMenuContext,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
};
