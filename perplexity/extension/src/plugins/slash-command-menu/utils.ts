import type { QueryBoxType } from "@/plugins/_core/ui/groups/query-box/types";

type PopoverPositionConfig = {
  placement: "top-start" | "bottom-start";
  gutter: number;
  flip: boolean;
};

export const getPopoverPositionConfig = (
  queryBoxType: QueryBoxType,
): PopoverPositionConfig => {
  const isSpaceQueryBox = queryBoxType === "space";
  return {
    placement: isSpaceQueryBox ? "bottom-start" : "top-start",
    gutter: 1,
    flip: isSpaceQueryBox,
  };
};

export const handleCommandInputKeyDown =
  (commandRef: React.RefObject<HTMLDivElement | null>) =>
  (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === Key.Enter) return;

    const commandItems = commandRef.current?.querySelectorAll("[cmdk-item]");
    commandItems?.forEach((item) => {
      if (item.getAttribute("aria-selected") === "true") {
        item.dispatchEvent(new KeyboardEvent("keydown", e as any));
      }
    });
  };
