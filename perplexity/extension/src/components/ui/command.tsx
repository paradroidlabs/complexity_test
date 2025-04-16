import { Command as CommandPrimitive } from "cmdk";
import * as React from "react";
import { LuSearch as Search } from "react-icons/lu";

import type { DialogProps } from "@/components/ui/dialog";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Command = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) => (
  <CommandPrimitive
    className={cn(
      "x:flex x:h-full x:w-full x:flex-col x:overflow-hidden x:rounded-md x:bg-popover x:text-popover-foreground",
      className,
    )}
    {...props}
  />
);
Command.displayName = CommandPrimitive.displayName;

type CommandDialogProps = DialogProps & {
  commandProps?: React.ComponentProps<typeof CommandPrimitive>;
};

const CommandDialog = ({
  children,
  commandProps,
  ...props
}: CommandDialogProps) => {
  return (
    <Dialog lazyMount unmountOnExit closeOnInteractOutside {...props}>
      <DialogContent className="x:overflow-hidden x:p-0 x:shadow-lg">
        <Command
          className="x:[&_[cmdk-group-heading]]:px-2 x:[&_[cmdk-group-heading]]:font-medium x:[&_[cmdk-group-heading]]:text-muted-foreground x:[&_[cmdk-group]]:px-2 x:[&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 x:[&_[cmdk-input-wrapper]_svg]:h-4 x:[&_[cmdk-input-wrapper]_svg]:w-4 x:[&_[cmdk-input]]:h-12 x:[&_[cmdk-item]]:px-2 x:[&_[cmdk-item]]:py-2 x:[&_[cmdk-item]_svg]:h-4 x:[&_[cmdk-item]_svg]:w-4"
          filter={(value, search, keywords) => {
            const extendValue = value + " " + (keywords?.join(" ") || "");
            if (extendValue.includes(search)) return 1;
            return 0;
          }}
          {...commandProps}
        >
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

CommandDialog.displayName = "CommandDialog";

const CommandInput = ({
  className,
  inputClassName,
  searchIcon = true,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input> & {
  inputClassName?: string;
  searchIcon?: boolean;
}) => (
  <div
    className={cn(
      "x:flex x:items-center x:border-b x:border-border/50 x:px-3",
      className,
    )}
    cmdk-input-wrapper=""
  >
    {searchIcon && (
      <Search className="x:mr-2 x:h-4 x:w-4 x:shrink-0 x:opacity-50" />
    )}
    <CommandPrimitive.Input
      className={cn(
        "x:flex x:h-11 x:w-full x:rounded-md x:bg-transparent x:py-3 x:text-sm x:outline-none x:placeholder:text-muted-foreground x:disabled:cursor-not-allowed x:disabled:opacity-50",
        inputClassName,
      )}
      {...props}
    />
  </div>
);

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) => (
  <CommandPrimitive.List
    className={cn(
      "custom-scrollbar x:max-h-[300px] x:overflow-x-hidden x:overflow-y-auto",
      className,
    )}
    {...props}
  />
);

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) => (
  <CommandPrimitive.Empty
    className={cn("x:py-6 x:text-center x:text-sm", className)}
    {...props}
  />
);

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) => (
  <CommandPrimitive.Group
    className={cn(
      "x:overflow-hidden x:p-1 x:text-foreground x:[&_[cmdk-group-heading]]:px-2 x:[&_[cmdk-group-heading]]:py-1.5 x:[&_[cmdk-group-heading]]:text-xs x:[&_[cmdk-group-heading]]:font-medium x:[&_[cmdk-group-heading]]:text-muted-foreground",
      className,
    )}
    {...props}
  />
);

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Separator>) => (
  <CommandPrimitive.Separator
    className={cn("x:-mx-1 x:h-px x:bg-border", className)}
    {...props}
  />
);
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = ({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) => (
  <CommandPrimitive.Item
    className={cn(
      "x:relative x:flex x:cursor-pointer x:items-center x:rounded-md x:px-2 x:py-1.5 x:text-xs x:text-muted-foreground x:outline-none x:select-none x:aria-selected:bg-primary-foreground x:aria-selected:text-primary x:data-[disabled=true]:pointer-events-none x:data-[disabled=true]:opacity-50",
      className,
    )}
    {...props}
  />
);

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "x:ml-auto x:text-xs x:tracking-widest x:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
};
