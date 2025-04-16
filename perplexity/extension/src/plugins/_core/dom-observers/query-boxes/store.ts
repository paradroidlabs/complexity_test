import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

export type QueryBoxesDomObserverStoreType = {
  main: {
    $mainQueryBox: JQuery<HTMLElement> | null;
    $spaceQueryBox: JQuery<HTMLElement> | null;
  };
  setMainNodes: (
    nodes: Partial<{
      $mainQueryBox: JQuery<HTMLElement> | null;
      $spaceQueryBox: JQuery<HTMLElement> | null;
    }>,
  ) => void;
  followUp: {
    $followUpQueryBox: JQuery<HTMLElement> | null;
  };

  resetStore: () => void;
};

export const queryBoxesDomObserverStore =
  createWithEqualityFn<QueryBoxesDomObserverStoreType>()(
    subscribeWithSelector(
      immer(
        (set): QueryBoxesDomObserverStoreType => ({
          main: {
            $mainQueryBox: null,
            $spaceQueryBox: null,
          },
          setMainNodes: (nodes) =>
            set((draft) => ({
              ...draft,
              main: {
                ...draft.main,
                ...nodes,
              },
            })),
          followUp: {
            $followUpQueryBox: null,
          },
          resetStore: () => {
            set({
              main: {
                $mainQueryBox: null,
                $spaceQueryBox: null,
              },
              followUp: {
                $followUpQueryBox: null,
              },
            });
          },
        }),
      ),
    ),
  );

export const useQueryBoxesDomObserverStore = queryBoxesDomObserverStore;
