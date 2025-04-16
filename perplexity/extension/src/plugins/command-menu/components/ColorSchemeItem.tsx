import { useCommandMenuStore } from "@/data/plugins/command-menu/store";
import type { ColorSchemeItem as ColorSchemeItemType } from "@/data/plugins/command-menu/types";
import { useColorSchemeStore } from "@/plugins/_core/global-stores/color-scheme-store";
import type { BaseCommandMenuItem } from "@/plugins/command-menu/components/BaseItem";
import BaseMenuItem from "@/plugins/command-menu/components/BaseItem";

type ColorSchemeItemProps = BaseCommandMenuItem & ColorSchemeItemType;

const ColorSchemeItem = memo((props: ColorSchemeItemProps) => {
  const searchValue = useCommandMenuStore((state) => state.searchValue);

  const { colorScheme, setColorScheme } = useColorSchemeStore();

  const shouldShow = colorScheme !== props.scheme || searchValue.length > 0;

  if (!shouldShow) return null;

  const { scheme, onSelect, ...baseMenuItemInheritedProps } = props;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      onSelect={onSelect || (() => setColorScheme(scheme))}
    />
  );
});

export default ColorSchemeItem;
