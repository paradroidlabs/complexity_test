import { onMessage } from "webext-bridge/content-script";

import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { networkInterceptMiddlewareManager } from "@/plugins/_api/network-intercept-middleware-manager/middleware-manager";
import type {
  BeaconEventData,
  FetchEventData,
  WebSocketEventData,
  XhrEventData,
} from "@/plugins/_core/main-world/network-intercept/listeners.types";

export type InterceptorsEvents = {
  "network-intercept:webSocketEvent": (
    event: WebSocketEventData,
  ) => WebSocketEventData["payload"];
  "network-intercept:xhrEvent": (
    event: XhrEventData,
  ) => XhrEventData["payload"];
  "network-intercept:fetchEvent": (
    event: FetchEventData,
  ) => FetchEventData["payload"];
  "network-intercept:beaconEvent": (
    event: BeaconEventData,
  ) => BeaconEventData["payload"];
};

declare module "@/types/webext-bridge-overrides" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface EventHandlers extends InterceptorsEvents {}
}

onlyExtensionGuard();

function setupInterceptorsListeners() {
  onMessage(
    "network-intercept:webSocketEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cwebSocketEvent", "color: blue", { event, payload });

      const newPayload =
        await networkInterceptMiddlewareManager.executeMiddlewares({
          data: { type: "network-intercept:webSocketEvent", event, payload },
        });

      return newPayload.payload;
    },
  );

  onMessage(
    "network-intercept:xhrEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cxhrEvent", "color: green", { event, payload });

      const newPayload =
        await networkInterceptMiddlewareManager.executeMiddlewares({
          data: { type: "network-intercept:xhrEvent", event, payload },
        });

      return newPayload.payload;
    },
  );

  onMessage(
    "network-intercept:fetchEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cfetchEvent", "color: red", { event, payload });

      const newPayload =
        await networkInterceptMiddlewareManager.executeMiddlewares({
          data: { type: "network-intercept:fetchEvent", event, payload },
        });

      return newPayload.payload;
    },
  );

  onMessage(
    "network-intercept:beaconEvent",
    async ({ data: { event, payload } }) => {
      // console.log("%cbeaconEvent", "color: purple", { event, payload });

      if (event === "response") return payload;

      const newPayload =
        await networkInterceptMiddlewareManager.executeMiddlewares({
          data: { type: "network-intercept:beaconEvent", event, payload },
        });

      return newPayload.payload;
    },
  );
}

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "messaging:networkIntercept": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "messaging:networkIntercept",
    dependencies: [],
    loader: setupInterceptorsListeners,
  });
}
