import type { BaseCommandMenuItem } from "@/plugins/command-menu/components/BaseItem";
import BaseMenuItem from "@/plugins/command-menu/components/BaseItem";
import { useCommandMenuStore } from "@/plugins/command-menu/public/store";
import type { SearchItem as SearchItemType } from "@/plugins/command-menu/public/types";

type SearchItemProps = BaseCommandMenuItem & SearchItemType;

export default function SearchItem(props: SearchItemProps) {
  const { filter, setFilter, setSearchValue } = useCommandMenuStore();

  if (filter === props.code) return null;

  const { code, onSelect, ...baseMenuItemInheritedProps } = props;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      closeOnSelect={false}
      onSelect={
        onSelect ||
        (() => {
          setFilter(props.code);
          setSearchValue("");
        })
      }
    />
  );
}
