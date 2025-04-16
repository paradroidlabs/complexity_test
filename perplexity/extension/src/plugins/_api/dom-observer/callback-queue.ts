import type { MaybePromise } from "@/types/utils.types";

const FRAME_BUDGET_MS = 16; // ~60fps
const MAX_CHUNK_SIZE = 20;
const INITIAL_CHUNK_SIZE = 5;
const RESET_TIMEOUT = 1000;

type CallbackQueueTaskPrefix =
  | "home"
  | "queryBoxes"
  | "thread"
  | "sidebar"
  | "spacesPage"
  | "settingsPage";

export type CallbackQueueTaskId = `${CallbackQueueTaskPrefix}:${string}` & {
  readonly __brand: unique symbol;
};

export function createTaskId(
  prefix: CallbackQueueTaskPrefix,
  id?: string,
): CallbackQueueTaskId {
  return `${prefix}:${id ?? "default"}` as CallbackQueueTaskId;
}

export type CallbackWithId = {
  callback: () => MaybePromise<void>;
  id: CallbackQueueTaskId;
};

class FastQueue {
  private queue: CallbackWithId[] = [];
  private idSet = new Set<CallbackQueueTaskId>();

  enqueue(item: CallbackWithId): void {
    if (this.idSet.has(item.id)) return;
    this.queue.push(item);
    this.idSet.add(item.id);
  }

  dequeueChunk(size: number): CallbackWithId[] {
    return this.queue.splice(0, size);
  }

  markProcessed(item: CallbackWithId): void {
    this.idSet.delete(item.id);
  }

  pushFront(items: CallbackWithId[]): void {
    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      if (item) {
        this.queue.unshift(item);
      }
    }
  }

  clear(): void {
    this.queue.length = 0;
    this.idSet.clear();
  }

  get isEmpty(): boolean {
    return this.queue.length === 0;
  }

  get length(): number {
    return this.queue.length;
  }
}

export class CallbackQueue {
  private static instance: CallbackQueue | null = null;
  private queue = new FastQueue();
  private dynamicChunkSize = INITIAL_CHUNK_SIZE;
  private resetTimer: number | null = null;
  private isProcessing = false;
  private shouldStop = false;
  private scheduledFrame: number | null = null;
  private averageProcessTime = 0;
  private readonly FRAME_HISTORY_WEIGHT = 0.2;

  private constructor() {}

  static getInstance(): CallbackQueue {
    if (!CallbackQueue.instance) {
      CallbackQueue.instance = new CallbackQueue();
    }
    return CallbackQueue.instance;
  }

  public enqueueArray(callbacks: CallbackWithId[]): void {
    callbacks.forEach((item) => this.queue.enqueue(item));
    this.scheduleProcessing();
  }

  public enqueue(
    callback: () => MaybePromise<void>,
    id: CallbackQueueTaskId,
  ): void {
    this.queue.enqueue({ callback, id });
    this.scheduleProcessing();
  }

  private scheduleProcessing(): void {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.shouldStop = false;
    this.cancelResetTimer();
    this.scheduledFrame = requestAnimationFrame(() => {
      this.scheduledFrame = null;
      if (!this.shouldStop) {
        this.processQueue();
      } else {
        this.isProcessing = false;
      }
    });
  }

  private async processQueue(): Promise<void> {
    if (this.shouldStop) {
      this.isProcessing = false;
      return;
    }

    const startTime = performance.now();
    const timeUsed = performance.now() - startTime;

    while (!this.queue.isEmpty && !this.shouldStop) {
      const timeRemaining = FRAME_BUDGET_MS - (performance.now() - startTime);

      const adaptiveChunkSize = Math.min(
        MAX_CHUNK_SIZE,
        Math.max(1, Math.floor(timeRemaining / (this.averageProcessTime || 1))),
      );

      const chunk = this.queue.dequeueChunk(adaptiveChunkSize);

      for (const item of chunk) {
        if (this.shouldStop) {
          this.queue.pushFront(chunk.slice(chunk.indexOf(item)));
          this.isProcessing = false;
          return;
        }

        const taskStart = performance.now();
        try {
          await item.callback();
        } catch (error) {
          console.error("Error processing callback:", error);
        } finally {
          this.queue.markProcessed(item);
          const taskTime = performance.now() - taskStart;
          this.averageProcessTime =
            this.averageProcessTime * (1 - this.FRAME_HISTORY_WEIGHT) +
            taskTime * this.FRAME_HISTORY_WEIGHT;
        }

        if (performance.now() - startTime > FRAME_BUDGET_MS) {
          this.queue.pushFront(chunk.slice(chunk.indexOf(item) + 1));
          this.isProcessing = false;
          this.dynamicChunkSize = Math.max(
            1,
            Math.floor(adaptiveChunkSize * 0.8),
          );
          this.scheduleProcessing();
          return;
        }
      }
    }

    this.dynamicChunkSize = Math.min(
      MAX_CHUNK_SIZE,
      Math.floor(
        this.dynamicChunkSize * (timeUsed < FRAME_BUDGET_MS ? 1.2 : 0.9),
      ),
    );

    this.isProcessing = false;
    if (!this.shouldStop) {
      this.startResetTimer();
    }
  }

  private startResetTimer(): void {
    this.cancelResetTimer();
    this.resetTimer = window.setTimeout(() => {
      if (this.dynamicChunkSize < MAX_CHUNK_SIZE) {
        this.dynamicChunkSize = MAX_CHUNK_SIZE;
      }
    }, RESET_TIMEOUT);
  }

  private cancelResetTimer(): void {
    if (this.resetTimer !== null) {
      clearTimeout(this.resetTimer);
      this.resetTimer = null;
    }
  }

  public clear(): void {
    this.shouldStop = true;
    if (this.scheduledFrame !== null) {
      cancelAnimationFrame(this.scheduledFrame);
      this.scheduledFrame = null;
    }
    this.queue.clear();
    this.cancelResetTimer();
    this.isProcessing = false;
  }
}
