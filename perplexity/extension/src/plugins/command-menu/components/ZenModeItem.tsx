import { formatKeys } from "@/components/hotkey-recorder/utils";
import type { BaseCommandMenuItem } from "@/plugins/command-menu/components/BaseItem";
import BaseMenuItem from "@/plugins/command-menu/components/BaseItem";
import type { ZenModeItem as ZenModeItemType } from "@/plugins/command-menu/public/types";
import { ExtensionSettingsService } from "@/services/extension-settings";

type ZenModeItemProps = BaseCommandMenuItem & ZenModeItemType;

const ZenModeItem = memo((props: ZenModeItemProps) => {
  const settings = ExtensionSettingsService.cachedSync;

  const { action, onSelect, ...baseMenuItemInheritedProps } = props;

  const isZenModeEnabled = $("body").attr("data-cplx-zen-mode") === "true";
  const isItemEnabled = props.type === "enable";

  const shouldShow = isZenModeEnabled !== isItemEnabled;

  if (!shouldShow) return null;

  return (
    <BaseMenuItem
      {...baseMenuItemInheritedProps}
      shortcut={formatKeys(settings?.plugins["zenMode"].hotkey)}
      onSelect={onSelect || action}
    />
  );
});

export default ZenModeItem;
