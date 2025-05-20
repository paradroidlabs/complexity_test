import { useEffect } from "react";

import { useSidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import { betterSidebarStore } from "@/plugins/better-sidebar/store";

const attrId = "better-sidebar-mobile-trigger-hook";

export default function useHookMobileTrigger() {
  const $mobileTrigger = useSidebarDomObserverStore(
    (state) => state.$mobileTrigger,
  );

  useEffect(() => {
    if (!$mobileTrigger) return;

    const mobileTriggerElement = $mobileTrigger[0];
    if (!mobileTriggerElement) return;

    const isHooked = mobileTriggerElement.getAttribute(attrId) === "true";

    if (isHooked) return;

    mobileTriggerElement.setAttribute(attrId, "true");

    const clickHandler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      betterSidebarStore.getState().setOpen(true);
    };

    mobileTriggerElement.addEventListener("click", clickHandler);

    return () => {
      mobileTriggerElement.removeEventListener("click", clickHandler);
      mobileTriggerElement.removeAttribute(attrId);
    };
  }, [$mobileTrigger]);
}
