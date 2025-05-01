import type { Command as CommandPrimitive } from "cmdk";
import type { ComponentProps } from "react";

import KeyCombo from "@/components/KeyCombo";
import { CommandItem, CommandShortcut } from "@/components/ui/command";
import { useCommandMenuStore } from "@/plugins/command-menu/public/store";
import type { BaseItem } from "@/plugins/command-menu/public/types";

export type BaseCommandMenuItem = BaseItem & {
  onSelect?: () => void;
};

type BaseMenuItemProps = ComponentProps<typeof CommandPrimitive.Item> &
  BaseCommandMenuItem & {
    closeOnSelect?: boolean;
  };

const BaseMenuItem = memo(function BaseMenuItem({
  icon: Icon,
  label,
  shortcut,
  keywords,
  onSelect,
  closeOnSelect = true,
  className,
  ...props
}: BaseMenuItemProps) {
  const { closeCommandMenu } = useCommandMenuStore();

  return (
    <CommandItem
      keywords={keywords}
      className={cn("x:font-medium", className)}
      onSelect={() => {
        onSelect?.();
        if (closeOnSelect) closeCommandMenu();
      }}
      {...props}
    >
      <Icon className="x:mr-2 x:size-4" />
      {label}
      {shortcut && (
        <CommandShortcut>
          <KeyCombo keys={shortcut} />
        </CommandShortcut>
      )}
    </CommandItem>
  );
});

export default BaseMenuItem;
