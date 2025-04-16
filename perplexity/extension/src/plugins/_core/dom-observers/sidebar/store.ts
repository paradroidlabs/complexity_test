import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type SidebarDomObserverStoreType = {
  $wrapper: JQuery<HTMLElement> | null;
  $spaceButtonWrapper: JQuery<HTMLElement> | null;
  $spaceButtonTriggerButtonsWrapper: JQuery<HTMLElement> | null;
  $libraryButtonWrapper: JQuery<HTMLElement> | null;
  $libraryButtonTriggerButtonsWrapper: JQuery<HTMLElement> | null;
  resetStore: () => void;
};

export const sidebarDomObserverStore =
  createWithEqualityFn<SidebarDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): SidebarDomObserverStoreType => ({
          $wrapper: null,
          $spaceButtonWrapper: null,
          $spaceButtonTriggerButtonsWrapper: null,
          $libraryButtonWrapper: null,
          $libraryButtonTriggerButtonsWrapper: null,
          resetStore: () => {
            set({
              $wrapper: null,
              $spaceButtonWrapper: null,
              $libraryButtonWrapper: null,
            });
          },
        }),
      ),
    ),
  );

export const useSidebarDomObserverStore = sidebarDomObserverStore;
