import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { getCookie } from "@/utils/utils";

export type BetterSidebarStoreType = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const betterSidebarStore =
  createWithEqualityFn<BetterSidebarStoreType>()(
    subscribeWithSelector(
      immer(
        (set): BetterSidebarStoreType => ({
          open: getCookie("isSidebarPinned") === "true",
          setOpen: (open) => set({ open }),
        }),
      ),
    ),
  );

export const useBetterSidebarStore = betterSidebarStore;
