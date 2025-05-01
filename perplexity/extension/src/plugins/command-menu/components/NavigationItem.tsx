import { sendMessage } from "webext-bridge/content-script";

import { useSpaRouter } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import type { BaseCommandMenuItem } from "@/plugins/command-menu/components/BaseItem";
import BaseMenuItem from "@/plugins/command-menu/components/BaseItem";
import { useCommandMenuStore } from "@/plugins/command-menu/public/store";
import type { NavigationItem as NavigationItemType } from "@/plugins/command-menu/public/types";
import { whereAmI } from "@/utils/utils";

type NavigationItemProps = BaseCommandMenuItem & NavigationItemType;

const NavigationItem = memo((props: NavigationItemProps) => {
  const { url } = useSpaRouter();

  const searchValue = useCommandMenuStore((state) => state.searchValue);

  const shouldShow = whereAmI(url) !== props.whereAmI || searchValue.length > 0;

  const defaultOnSelect = useCallback(() => {
    if (!props.path) return;

    sendMessage(
      "spa-router:push",
      {
        url: props.path,
      },
      "window",
    );
  }, [props.path]);

  if (!shouldShow) return null;

  const {
    path,
    whereAmI: _,
    external,
    onSelect,
    ...baseMenuItemInheritedProps
  } = props;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      onSelect={onSelect || defaultOnSelect}
    />
  );
});

export default NavigationItem;
