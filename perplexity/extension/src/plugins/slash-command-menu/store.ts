import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { FilterMode } from "@/plugins/slash-command-menu/FilterItems";
import {
  deleteSelectedText,
  getActiveTextarea,
  insertText,
  setTextareaSelection,
} from "@/utils/textarea-utils";
import { UiUtils } from "@/utils/ui-utils";

type SlashCommandMenuStore = {
  isOpen: boolean;
  selectedValue: string;
  searchValue: string;
  filter: FilterMode | null;
  searchValueBoundary: {
    ignoreLeftCount: number | null;
    ignoreRightCount: number | null;
  };
  actions: {
    setIsOpen: (isOpen: boolean) => void;
    setSelectedValue: (value: string) => void;
    setSearchValue: (value: string) => void;
    setSearchValueBoundary: (boundary: {
      ignoreLeftCount: number | null;
      ignoreRightCount: number | null;
    }) => void;
    setFilter: (filter: FilterMode | null) => void;
    insertTextAtCaret: (text: string) => void;
    deleteTriggerWord: () => void;
    clearSearchValue: () => void;
  };
};

export const slashCommandMenuStore =
  createWithEqualityFn<SlashCommandMenuStore>()(
    subscribeWithSelector(
      immer(
        (set, get): SlashCommandMenuStore => ({
          isOpen: false,
          selectedValue: "",
          searchValue: "",
          filter: null,
          searchValueBoundary: {
            ignoreLeftCount: null,
            ignoreRightCount: null,
          },
          actions: {
            setIsOpen: (isOpen) => {
              set((state) => {
                if (isOpen) {
                  state.isOpen = isOpen;
                  state.searchValue = "";
                  state.filter = null;
                  state.selectedValue = "";
                } else {
                  state.isOpen = isOpen;
                }
              });
            },
            setSelectedValue: (value) => set({ selectedValue: value }),
            setSearchValue: (value) => set({ searchValue: value }),
            setSearchValueBoundary: (boundary) =>
              set({ searchValueBoundary: boundary }),
            setFilter: (filter) => set({ filter }),
            insertTextAtCaret: (text) => {
              get().actions.deleteTriggerWord();
              queueMicrotask(() => {
                const textarea = getActiveTextarea();
                if (!textarea) return;

                insertText(textarea, text);
                UiUtils.scrollIntoCaretView(textarea);
              });
            },
            deleteTriggerWord: () => {
              const textarea = getActiveTextarea();
              if (!textarea) return;

              const { ignoreLeftCount, ignoreRightCount } =
                get().searchValueBoundary;
              if (ignoreLeftCount == null || ignoreRightCount == null) return;

              setTextareaSelection(
                textarea,
                ignoreLeftCount - 1,
                textarea.value.length - ignoreRightCount,
              );
              queueMicrotask(() => deleteSelectedText(textarea));
            },
            clearSearchValue: () => {
              const textarea = getActiveTextarea();
              if (!textarea) return;

              const { ignoreLeftCount, ignoreRightCount } =
                get().searchValueBoundary;
              if (ignoreLeftCount == null || ignoreRightCount == null) return;

              const selectionStart = ignoreLeftCount;
              const selectionEnd = textarea.value.length - ignoreRightCount;

              if (selectionEnd - selectionStart < 1) return;

              setTextareaSelection(textarea, selectionStart, selectionEnd);
              queueMicrotask(() => {
                deleteSelectedText(textarea);
                set({ searchValue: "" });
              });
            },
          },
        }),
      ),
    ),
  );

export const useSlashCommandMenuStore = slashCommandMenuStore;

export const useSlashCommandMenuIsOpen = () =>
  slashCommandMenuStore((state) => state.isOpen);

export const useSlashCommandMenuSearchValue = () =>
  slashCommandMenuStore((state) => state.searchValue);

export const useSlashCommandMenuFilter = () =>
  slashCommandMenuStore((state) => state.filter);

export const useSlashCommandMenuSelectedValue = () =>
  slashCommandMenuStore((state) => state.selectedValue);

export const useSlashCommandMenuActions = () =>
  slashCommandMenuStore((state) => state.actions);
