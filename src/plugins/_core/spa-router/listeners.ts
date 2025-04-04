import { onMessage } from "webext-bridge/content-script";
import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  createWithEqualityFn,
  useStoreWithEqualityFn,
} from "zustand/traditional";

import { RouterEvent } from "@/plugins/_core/spa-router/spa-router.types";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "spa-router:route-change": ({
      state,
      trigger,
      newUrl,
    }: {
      state: "pending" | "complete";
      trigger: RouterEvent;
      newUrl: string;
    }) => void;
  }
}

onlyExtensionGuard();

function setupSpaRouterDispatchListeners() {
  onMessage(
    "spa-router:route-change",
    ({ data: { state, trigger, newUrl } }) => {
      spaRouterStore.setState({ state, url: newUrl, trigger });
    },
  );
}

csLoaderRegistry.register({
  id: "messaging:spaRouter",
  loader: setupSpaRouterDispatchListeners,
});

type SpaRouterStore = {
  state: "pending" | "complete";
  url: string;
  trigger: RouterEvent;
};

const spaRouterStore = createWithEqualityFn<SpaRouterStore>()(
  subscribeWithSelector(
    immer(
      (): SpaRouterStore => ({
        state: "complete",
        url: window.location.href,
        trigger: "push",
      }),
    ),
  ),
);

export const spaRouterStoreSubscribe = spaRouterStore.subscribe;

export const spaRouteChangeCompleteSubscribe = (
  callback: (url: string) => void,
) => {
  return spaRouterStore.subscribe(
    (store) => ({ state: store.state, url: store.url }),
    ({ state, url }) => {
      if (state === "complete") callback(url);
    },
  );
};

export const useSpaRouter = <T = SpaRouterStore>(
  selector?: (state: SpaRouterStore) => T,
) => {
  return useStoreWithEqualityFn(
    spaRouterStore,
    selector ??
      ((state) =>
        ({
          url: state.url,
          trigger: state.trigger,
        }) as T),
  );
};
