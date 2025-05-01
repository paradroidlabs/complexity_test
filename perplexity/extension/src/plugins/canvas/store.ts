import type { SandpackPreviewRef } from "@codesandbox/sandpack-react";
import type { ComponentType, SVGProps } from "react";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import type { CanvasState } from "@/plugins/canvas/types";

export type CodeBlockLocation = {
  messageBlockIndex: number;
  codeBlockIndex: number;
};

export type CanvasBlock = {
  Icon: ComponentType<SVGProps<SVGElement>>;
  count: number;
  title: string;
  description: string;
  onClick: () => void;
  isInFlight: boolean;
  location: CodeBlockLocation[];
};

type CanvasStoreType = {
  isCanvasListOpen: boolean;
  openCanvasList: () => void;
  closeCanvasList: () => void;
  canvasBlocks: Record<string, CanvasBlock>;
  selectedCodeBlockLocation: CodeBlockLocation | null;
  setselectedCodeBlockLocation: (location: CodeBlockLocation) => void;
  state: CanvasState;
  setState: (state: CanvasState) => void;
  isValidCanvasCode: boolean;
  hasAutoPreviewTriggered: boolean;
  lastAutoOpenCodeBlockLocation: CodeBlockLocation | null;
  setHasAutoPreviewTriggered: (value: boolean) => void;
  setLastAutoOpenCodeBlockLocation: (value: CodeBlockLocation | null) => void;
  close: () => void;
  refreshPreviewKey: number;
  refreshPreview: () => void;
  sandpackPreviewRef: SandpackPreviewRef | null;
  setSandpackPreviewRef: (ref: SandpackPreviewRef | null) => void;
};

export const canvasStore = createWithEqualityFn<CanvasStoreType>()(
  subscribeWithSelector(
    immer(
      (set): CanvasStoreType => ({
        isCanvasListOpen: false,
        canvasBlocks: {},
        selectedCodeBlockLocation: null,
        state: "code",
        isValidCanvasCode: false,
        hasAutoPreviewTriggered: false,
        lastAutoOpenCodeBlockLocation: null,
        refreshPreviewKey: 0,

        openCanvasList: () => {
          set({ isCanvasListOpen: true, selectedCodeBlockLocation: null });
        },
        closeCanvasList: () => set({ isCanvasListOpen: false }),
        setselectedCodeBlockLocation: (location) =>
          set({ selectedCodeBlockLocation: location }),
        setState: (state) => set({ state }),
        setHasAutoPreviewTriggered: (value) =>
          set((draft) => {
            draft.hasAutoPreviewTriggered = value;
          }),
        setLastAutoOpenCodeBlockLocation: (value) =>
          set((draft) => {
            draft.lastAutoOpenCodeBlockLocation = value;
          }),
        close: () =>
          set((draft) => {
            draft.selectedCodeBlockLocation = null;
          }),
        refreshPreview: () =>
          set((draft) => {
            draft.refreshPreviewKey++;
          }),
        sandpackPreviewRef: null,
        setSandpackPreviewRef: (ref) => set({ sandpackPreviewRef: ref }),
      }),
    ),
  ),
);

export const useCanvasStore = canvasStore;
