import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type HomeDomObserverStoreType = {
  $slogan: JQuery<HTMLElement> | null;
  $bottomBar: JQuery<HTMLElement> | null;
  resetStore: () => void;
};

export const homeDomObserverStore =
  createWithEqualityFn<HomeDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): HomeDomObserverStoreType => ({
          $slogan: null,
          $bottomBar: null,
          resetStore: () => {
            set({
              $slogan: null,
              $bottomBar: null,
            });
          },
        }),
      ),
    ),
  );

export const useHomeDomObserverStore = homeDomObserverStore;
