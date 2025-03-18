import { useSyncExternalStore } from "react";

import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";

type TocItem = {
  id: string;
  title: string;
  element: JQuery<Element>;
  isActive?: boolean;
};

type MessageBlock = {
  nodes: {
    $wrapper: JQuery<Element>;
  };
  content: {
    title: string;
  };
};

type TocStore = {
  items: TocItem[];
  activeId: string | null;
  observer: IntersectionObserver | null;
};

const createTocStore = () => {
  const state: TocStore = {
    items: [],
    activeId: null,
    observer: null,
  };

  let lastMessageBlocks: MessageBlock[] | null = null;

  const listeners = new Set<() => void>();

  const getSnapshot = () => {
    const messageBlocks =
      useThreadMessageBlocksDomObserverStore.getState().messageBlocks;

    if (!deepEqual(messageBlocks, lastMessageBlocks)) {
      lastMessageBlocks = messageBlocks;
      updateItems(messageBlocks);
    }

    return state.items;
  };

  const subscribe = (listener: () => void) => {
    listeners.add(listener);

    const unsubscribeMessageBlocks =
      useThreadMessageBlocksDomObserverStore.subscribe(
        ({ messageBlocks }) => messageBlocks,
        listener,
        { equalityFn: deepEqual },
      );

    return () => {
      listeners.delete(listener);
      unsubscribeMessageBlocks();

      if (listeners.size === 0 && state.observer) {
        state.observer.disconnect();
        state.observer = null;
      }
    };
  };

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const updateItems = (messageBlocks: MessageBlock[] | null) => {
    if (!messageBlocks) return;

    if (state.observer) {
      state.observer.disconnect();
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            state.activeId = entry.target.id;
            state.items = state.items.map((item) => ({
              ...item,
              isActive: item.id === entry.target.id,
            }));
            notify();
          }
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
        const id = `toc-item-${idx}`;
        $wrapper.attr("id", id);
        observer.observe($wrapper[0]);

        return {
          id,
          title: title.length > 0 ? title : (state.items[idx]?.title ?? ""),
          element: $wrapper,
          isActive: id === state.activeId,
        };
      },
    );

    notify();
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
