import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import {
  CallbackQueue,
  type CallbackWithId,
} from "@/plugins/_api/dom-observer/callback-queue";
import type { CallbackQueueTaskId } from "@/plugins/_api/dom-observer/callback-queue";
import type { MaybePromise } from "@/types/utils.types";

describe("CallbackQueue", () => {
  let queue: CallbackQueue;
  const FRAME_BUDGET_MS = 16;

  const flushPendingOperations = async (flushCycles = 3) => {
    for (let i = 0; i < flushCycles; i++) {
      vi.runAllTimers();
      await Promise.resolve();
    }
  };

  const createBrowserMocks = () => ({
    requestAnimationFrame: vi.fn((callback) => {
      return setTimeout(() => callback(Date.now()), 0);
    }),
    cancelAnimationFrame: vi.fn((timerId) => {
      clearTimeout(timerId);
    }),
    setTimeout,
    clearTimeout,
    performance: { now: vi.fn(() => Date.now()) },
  });

  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const queueClass = CallbackQueue as unknown as {
      instance: CallbackQueue | null;
    };
    queueClass.instance = null;

    const browserMocks = createBrowserMocks();
    vi.stubGlobal("window", browserMocks);
    vi.stubGlobal("requestAnimationFrame", browserMocks.requestAnimationFrame);
    vi.stubGlobal("cancelAnimationFrame", browserMocks.cancelAnimationFrame);
    vi.stubGlobal("setTimeout", browserMocks.setTimeout);
    vi.stubGlobal("clearTimeout", browserMocks.clearTimeout);
    vi.stubGlobal("performance", browserMocks.performance);

    queue = CallbackQueue.getInstance();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    queue.clear();
  });

  it("should maintain singleton instance", () => {
    const firstInstance = CallbackQueue.getInstance();
    const secondInstance = CallbackQueue.getInstance();
    expect(firstInstance).toBe(secondInstance);
  });

  it("should process single callback", async () => {
    const mockCallback = vi.fn();
    queue.enqueue(mockCallback, "1" as CallbackQueueTaskId);
    await flushPendingOperations();
    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should process multiple callbacks in order", async () => {
    const executionOrder: number[] = [];
    const orderedCallbacks: CallbackWithId[] = [1, 2, 3].map((num) => ({
      callback: () => {
        executionOrder.push(num);
      },
      id: `callback-${num}` as CallbackQueueTaskId,
    }));

    queue.enqueueArray(orderedCallbacks);
    await flushPendingOperations();
    expect(executionOrder).toEqual([1, 2, 3]);
  });

  it("should handle async callbacks", async () => {
    const executionResults: number[] = [];
    const delayedCallback = async () => {
      await new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 10);
      });
      executionResults.push(1);
    };

    queue.enqueue(delayedCallback, "async" as CallbackQueueTaskId);
    await flushPendingOperations();
    vi.advanceTimersByTime(10);
    await Promise.resolve();

    expect(executionResults).toEqual([1]);
  });

  it("should handle errors in callbacks without breaking the queue", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const successCallback = vi.fn();

    queue.enqueueArray([
      {
        callback: () => {
          throw new Error("Test error");
        },
        id: "failing-callback" as CallbackQueueTaskId,
      },
      {
        callback: successCallback,
        id: "success-callback" as CallbackQueueTaskId,
      },
    ]);

    await flushPendingOperations();

    expect(errorSpy).toHaveBeenCalled();
    expect(successCallback).toHaveBeenCalled();
  });

  it("should prevent duplicate callbacks with same id", async () => {
    const mockCallback = vi.fn();
    const duplicateId = "duplicate-task" as CallbackQueueTaskId;

    queue.enqueue(mockCallback, duplicateId);
    queue.enqueue(mockCallback, duplicateId);
    queue.enqueue(mockCallback, duplicateId);

    await flushPendingOperations();

    expect(mockCallback).toHaveBeenCalledTimes(1);
  });

  it("should clear the queue", async () => {
    const mockCallback = vi.fn();
    const mockCallback2 = vi.fn();

    vi.useFakeTimers();

    queue.enqueueArray([
      { callback: mockCallback, id: "task1" as CallbackQueueTaskId },
      { callback: mockCallback2, id: "task2" as CallbackQueueTaskId },
    ]);

    queue.clear();

    await vi.runAllTimersAsync();
    await Promise.resolve();

    expect(mockCallback).not.toHaveBeenCalled();
    expect(mockCallback2).not.toHaveBeenCalled();

    const postClearCallback = vi.fn();
    queue.enqueue(postClearCallback, "post-clear" as CallbackQueueTaskId);
    await flushPendingOperations();
    expect(postClearCallback).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("should process callbacks in insertion order", async () => {
    const executionOrder: string[] = [];
    const orderedCallbacks: CallbackWithId[] = [1, 2, 3].map((num) => ({
      id: `callback-${num}` as CallbackQueueTaskId,
      callback: () => {
        executionOrder.push(`execution-${num}`);
      },
    }));

    queue.enqueueArray(orderedCallbacks);
    await flushPendingOperations();

    expect(executionOrder).toEqual([
      "execution-1",
      "execution-2",
      "execution-3",
    ]);
  });

  it("should handle asynchronous callbacks correctly", async () => {
    const executionResults: number[] = [];
    const createDelayedOperation =
      (value: number, delay: number): (() => MaybePromise<void>) =>
      async () => {
        await new Promise<void>((resolve) => {
          setTimeout(() => {
            executionResults.push(value);
            resolve();
          }, delay);
        });
      };

    queue.enqueue(
      createDelayedOperation(1, 10),
      "delayed-operation-1" as CallbackQueueTaskId,
    );
    queue.enqueue(
      createDelayedOperation(2, 5),
      "delayed-operation-2" as CallbackQueueTaskId,
    );

    await flushPendingOperations(10);
    vi.advanceTimersByTime(20);
    await Promise.resolve();

    expect(executionResults).toEqual([1, 2]);
  });

  it("should respect frame budget when processing callbacks", async () => {
    const executionTimes: number[] = [];
    let currentTime = 0;

    vi.mocked(performance.now).mockImplementation(() => currentTime);

    const createTimedOperation = (
      duration: number,
    ): (() => MaybePromise<void>) => {
      return () => {
        currentTime += duration;
        executionTimes.push(duration);
      };
    };

    const operations = [
      { duration: 5, id: "fast-1" },
      { duration: 5, id: "fast-2" },
      { duration: FRAME_BUDGET_MS + 1, id: "slow-1" },
      { duration: 5, id: "fast-3" },
      { duration: 5, id: "fast-4" },
    ].map(({ duration, id }) => ({
      callback: createTimedOperation(duration) as () => MaybePromise<void>,
      id: id as CallbackQueueTaskId,
    }));

    queue.enqueueArray(operations);

    await flushPendingOperations(10);

    expect(executionTimes.length).toBe(5);
    expect(
      vi.mocked(window.requestAnimationFrame).mock.calls.length,
    ).toBeGreaterThan(1);
  });
});
