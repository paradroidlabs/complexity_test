import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type SidebarDomObserverStoreType = {
  $wrapper: JQuery<HTMLElement> | null;
  resetStore: () => void;
};

export const sidebarDomObserverStore =
  createWithEqualityFn<SidebarDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): SidebarDomObserverStoreType => ({
          $wrapper: null,
          resetStore: () => {
            set({
              $wrapper: null,
            });
          },
        }),
      ),
    ),
  );

export const useSidebarDomObserverStore = sidebarDomObserverStore;
