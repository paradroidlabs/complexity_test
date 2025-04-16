import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import type { SearchItem as SearchItemType } from "@/data/plugins/command-menu/types";
import type { BaseCommandMenuItem } from "@/plugins/command-menu/components/BaseItem";
import BaseMenuItem from "@/plugins/command-menu/components/BaseItem";

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
