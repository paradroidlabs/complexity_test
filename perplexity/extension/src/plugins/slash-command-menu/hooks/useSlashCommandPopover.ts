import { usePopover } from "@ark-ui/react";

import { useScopedQueryBoxContext } from "@/plugins/_core/ui/groups/query-box/context/context";
import { useSlashCommandMenuIsOpen } from "@/plugins/slash-command-menu/store";
import { getPopoverPositionConfig } from "@/plugins/slash-command-menu/utils";

type UseSlashCommandPopoverProps = {
  anchor: HTMLElement | null;
};

export const useSlashCommandPopover = ({
  anchor,
}: UseSlashCommandPopoverProps) => {
  const { store } = useScopedQueryBoxContext();
  const isOpen = useSlashCommandMenuIsOpen();

  const positioningOptions = useMemo(
    () => ({
      ...getPopoverPositionConfig(store.type),
      getAnchorRect: () => anchor?.getBoundingClientRect() ?? null,
    }),
    [store.type, anchor],
  );

  return usePopover({
    open: isOpen,
    positioning: positioningOptions,
    portalled: false,
    autoFocus: false,
    modal: false,
  });
};
