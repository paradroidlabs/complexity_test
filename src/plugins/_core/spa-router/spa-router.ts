import { sendMessage } from "webext-bridge/window";

import {
  NextRouter,
  RouterEvent,
} from "@/plugins/_core/spa-router/spa-router.types";
import {
  applyRouteIdAttrs,
  isNextWindowObjectExists,
  waitForRouteChangeComplete,
} from "@/plugins/_core/spa-router/utils";
import { whereAmI } from "@/utils/utils";

onlyMainWorldGuard();

let lastDispatchedUrl: string | null = null;

export function proxyNextRouter() {
  if (!isNextWindowObjectExists()) throw new Error("Next.js router not found");

  const router = window.next!.router;
  const originalPush = router.push;
  const originalReplaceState = history.replaceState;

  router.push = createProxiedPush(originalPush);

  history.replaceState = createProxiedReplaceState(originalReplaceState);

  window.addEventListener("popstate", () =>
    dispatchRouteChange({
      trigger: "popstate",
      newUrl: window.location.href,
    }),
  );

  applyRouteIdAttrs(whereAmI());
}

function createProxiedPush(
  originalPush: NonNullable<NextRouter>["router"]["push"],
) {
  return async function (this: NextRouter, url: string): Promise<void> {
    originalPush.apply(this, [url]);
    dispatchRouteChange({
      trigger: "push",
      newUrl: url,
    });
  };
}

function createProxiedReplaceState(
  originalReplaceState: typeof history.replaceState,
) {
  return function (
    this: History,
    data: unknown,
    unused: string,
    url?: string | URL | null,
  ): void {
    originalReplaceState.apply(this, [data, unused, url]);
    if (typeof url === "string") {
      dispatchRouteChange({
        trigger: "replace",
        newUrl: url,
      });
    }
  };
}

const dispatchRouteChange = async ({
  trigger,
  newUrl,
}: {
  trigger: RouterEvent;
  newUrl: string;
}) => {
  const url = new URL(newUrl, window.location.href);
  const fullUrl = url.pathname + url.search + url.hash;

  if (fullUrl !== lastDispatchedUrl) {
    lastDispatchedUrl = fullUrl;

    sendMessage(
      "spa-router:route-change",
      { state: "pending", trigger, newUrl: fullUrl },
      "content-script",
    );

    await waitForRouteChangeComplete(whereAmI(fullUrl));

    if (fullUrl !== lastDispatchedUrl) {
      console.warn(
        "[SPA Router] Stale state detected.",
        `Attempted to route to ${fullUrl} but the last dispatched url is ${lastDispatchedUrl}`,
      );
      return;
    }

    sendMessage(
      "spa-router:route-change",
      { state: "complete", trigger, newUrl: fullUrl },
      "content-script",
    );
  }
};
