import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type ThreadDomObserverStoreType = {
  $navbar: JQuery<HTMLElement> | null;
  $overflowMenuButtonWrapper: JQuery<HTMLElement> | null;
  $wrapper: JQuery<HTMLElement> | null;
  $pageWrapper: JQuery<HTMLElement> | null;
  $popper: JQuery<HTMLElement> | null;
  messageStickyHeaderHeight: number | null;
  states: {
    isInFlight: boolean; // >= 1 message is in-flight
  };
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
          $pageWrapper: null,
          $popper: null,
          messageStickyHeaderHeight: null,
          states: {
            isInFlight: false,
          },
          resetStore: () => {
            set({
              $navbar: null,
              $overflowMenuButtonWrapper: null,
              $wrapper: null,
              $pageWrapper: null,
              $popper: null,
              messageStickyHeaderHeight: null,
              states: {
                isInFlight: false,
              },
            });
          },
        }),
      ),
    ),
  );

export const useThreadDomObserverStore = threadDomObserverStore;
