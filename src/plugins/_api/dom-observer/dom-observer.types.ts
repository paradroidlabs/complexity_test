import { ObserverId } from "@/plugins/_api/dom-observer/observer-ids";

export type MutationCallback = () => void | Promise<void>;

export type MutationConfig = MutationObserverInit;

export type DomObserverConfig = {
  readonly target: Element | null;
  readonly config: MutationConfig;
  readonly debounceTime?: number;
  readonly fireImmediately?: boolean;
  readonly onMutation: MutationCallback;
};

export type DomObserverInstance = {
  observer: MutationObserver;
  config: DomObserverConfig;
  isPaused: boolean;
};

export type DomObserverError = {
  readonly code: string;
  readonly message: string;
  readonly context?: unknown;
};

export type Result<T> = {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: DomObserverError;
};

export type ObserverOperation = {
  readonly type: "create" | "update" | "destroy" | "pause" | "resume" | "forceTrigger";
  readonly id: ObserverId;
  readonly config?: Partial<DomObserverConfig>;
};
