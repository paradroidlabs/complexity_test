import { useSyncExternalStore } from "react";

import { threadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { MessageBlock } from "@/plugins/_core/dom-observers/thread/message-blocks/types";

export type TocItem = {
  id: number;
  title: string;
  element: JQuery<Element>;
  isActive?: boolean;
};

type TocStore = {
  items: TocItem[];
  activeId: number | null;
  observer: IntersectionObserver | null;
};

const createTocStore = () => {
  const state: TocStore = {
    items: [],
    activeId: null,
    observer: null,
  };

  // Helper function to safely disconnect and clean up the observer
  const cleanupObserver = () => {
    if (state.observer) {
      state.observer.disconnect();
      state.observer = null;
    }
  };

  let lastMessageBlocks: MessageBlock[] | null = null;

  const listeners = new Set<() => void>();

  const getSnapshot = () => {
    const messageBlocks =
      threadMessageBlocksDomObserverStore.getState().messageBlocks;

    if (!deepEqual(messageBlocks, lastMessageBlocks)) {
      lastMessageBlocks = messageBlocks;
      updateItems(messageBlocks);
    }

    return state.items;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    const unsubscribeMessageBlocks =
      threadMessageBlocksDomObserverStore.subscribe(
        ({ messageBlocks }) => messageBlocks,
        listener,
        { equalityFn: deepEqual },
      );

    return () => {
      listeners.delete(listener);
      unsubscribeMessageBlocks();
      cleanupObserver();
    };
  };

  const emitChanges = () => {
    listeners.forEach((listener) => listener());
  };

  const updateItems = (messageBlocks: MessageBlock[] | null) => {
    if (!messageBlocks) return;

    cleanupObserver();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const elementId = entry.target.getAttribute("data-index");

          if (!elementId) return;

          state.activeId = parseInt(elementId);
          state.items = state.items.map((item) => ({
            ...item,
            isActive: item.id === state.activeId,
          }));

          emitChanges();
        });
      },
      {
        threshold: 0,
        rootMargin: "-49% 0px -49% 0px",
      },
    );

    state.observer = observer;

    state.items = messageBlocks.map(
      ({ nodes: { $wrapper }, content: { title } }, idx: number) => {
        if ($wrapper != null && $wrapper.length > 0) {
          observer.observe($wrapper[0]);
        }

        return {
          id: idx,
          title: title.length > 0 ? title : (state.items[idx]?.title ?? ""),
          element: $wrapper,
          isActive: idx === state.activeId,
        };
      },
    );

    emitChanges();
  };

  return {
    subscribe,
    getSnapshot,
  };
};

const tocStore = createTocStore();

export function useThreadTocItems() {
  return useSyncExternalStore(tocStore.subscribe, tocStore.getSnapshot);
}
