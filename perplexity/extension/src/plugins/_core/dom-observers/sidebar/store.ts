import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { PplxSidebarV2Tab } from "@/plugins/_core/dom-observers/sidebar/types";

type SidebarDomObserverStoreType = {
  $wrapper: JQuery<HTMLElement> | null;
  activePplxSidebarV2Tab: PplxSidebarV2Tab | null;
  resetStore: () => void;
};

export const sidebarDomObserverStore =
  createWithEqualityFn<SidebarDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): SidebarDomObserverStoreType => ({
          $wrapper: null,
          activePplxSidebarV2Tab: null,
          resetStore: () => {
            set({
              $wrapper: null,
              activePplxSidebarV2Tab: null,
            });
          },
        }),
      ),
    ),
  );

export const useSidebarDomObserverStore = sidebarDomObserverStore;
