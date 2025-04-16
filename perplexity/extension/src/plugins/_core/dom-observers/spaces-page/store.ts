import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

type SpacesPageDomObserverStoreType = {
  spaceCards: JQuery<HTMLElement>[] | null;
  resetStore: () => void;
};

export const spacesPageDomObserverStore =
  createWithEqualityFn<SpacesPageDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): SpacesPageDomObserverStoreType => ({
          spaceCards: null,
          resetStore: () => {
            set({
              spaceCards: null,
            });
          },
        }),
      ),
    ),
  );

export const useSpacesPageDomObserverStore = spacesPageDomObserverStore;
