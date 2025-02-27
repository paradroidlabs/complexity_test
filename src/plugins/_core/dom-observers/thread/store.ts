import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type ThreadDomObserverStoreType = {
  $navbar: JQuery<HTMLElement> | null;
  $overflowMenuButtonWrapper: JQuery<HTMLElement> | null;
  $wrapper: JQuery<HTMLElement> | null;
  $popper: JQuery<HTMLElement> | null;
  resetStore: () => void;
};

export const threadDomObserverStore =
  createWithEqualityFn<ThreadDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): ThreadDomObserverStoreType => ({
          $navbar: null,
          $overflowMenuButtonWrapper: null,
          $wrapper: null,
          $popper: null,
          resetStore: () => {
            set({
              $navbar: null,
              $overflowMenuButtonWrapper: null,
              $wrapper: null,
              $popper: null,
            });
          },
        }),
      ),
    ),
  );

export const useThreadDomObserverStore = threadDomObserverStore;
