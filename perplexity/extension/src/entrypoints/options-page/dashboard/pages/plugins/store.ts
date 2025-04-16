import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { PluginTagValues } from "@/data/plugin-registry/plugin-tags";

export type PluginFilters = {
  tags: PluginTagValues[];
  excludeTags: PluginTagValues[];
  searchTerm: string;
};

const defaultFilters: PluginFilters = {
  tags: [],
  excludeTags: [],
  searchTerm: "",
};

type PluginFiltersStore = {
  filters: PluginFilters;
  setFilters: (filters: PluginFilters) => void;
};

export const pluginFiltersStore = createWithEqualityFn<PluginFiltersStore>()(
  subscribeWithSelector(
    immer(
      (set): PluginFiltersStore => ({
        filters: defaultFilters,
        setFilters: (filters) => set({ filters }),
      }),
    ),
  ),
);

export const usePluginFiltersStore = pluginFiltersStore;
