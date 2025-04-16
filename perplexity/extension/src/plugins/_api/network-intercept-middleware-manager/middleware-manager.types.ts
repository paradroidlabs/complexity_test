import type { InterceptorsEvents } from "@/plugins/_core/main-world/network-intercept/listeners.loader";
import type {
  FetchEventData,
  WebSocketEventData,
  XhrEventData,
} from "@/plugins/_core/main-world/network-intercept/listeners.types";
import type { MaybePromise } from "@/types/utils.types";

export type MiddlewareData = (
  | WebSocketEventData
  | XhrEventData
  | FetchEventData
) & {
  type: keyof InterceptorsEvents;
};

type MiddleWareReturnType<T extends MiddlewareData> = MaybePromise<
  T["payload"]["data"]
>;

export type Middleware = {
  id: string;
  middlewareFn: <T extends MiddlewareData>(params: {
    data: T;
    stopPropagation: (data?: MiddlewareData["payload"]["data"]) => never;
    skip: () => never;
    removeMiddleware: () => void;
  }) => MiddleWareReturnType<T>;
  priority?: MiddlewarePriority;
};

export type MiddlewarePriority =
  | MiddlewarePositionBasedPriority
  | MiddlewareNameBasedPriority;

export type MiddlewarePositionBasedPriority = {
  position: "first" | "last";
};

export type MiddlewareNameBasedPriority = {
  position: "beforeId" | "afterId";
  id: string;
};
