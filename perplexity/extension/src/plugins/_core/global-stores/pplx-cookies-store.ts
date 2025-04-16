import { subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { createWithEqualityFn } from "zustand/traditional";

import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import { createDomObserverId } from "@/plugins/_api/dom-observer/dom-observer.types";

type Cookie = {
  name: string;
  value: string;
};

type PplxCookiesStoreType = {
  cookies: Cookie[];
};

export const pplxCookiesStore = createWithEqualityFn<PplxCookiesStoreType>()(
  subscribeWithSelector(
    immer(
      (): PplxCookiesStoreType => ({
        cookies: [],
      }),
    ),
  ),
);

export const usePplxCookiesStore = pplxCookiesStore;

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "store:pplxCookies": void;
  }
}

asyncLoaderRegistry.register({
  id: "store:pplxCookies",
  dependencies: ["cache:extensionSettings"],
  loader: () => {
    parseCookies();

    DomObserver.create(createDomObserverId("misc", "pplxCookies"), {
      target: document.body,
      config: { childList: true, subtree: true },
      onMutation: parseCookies,
    });
  },
});

export function parseCookies() {
  const cookieStrings = document.cookie.split(";");

  const parsedCookies: Cookie[] = cookieStrings
    .map((cookieStr) => {
      const parts = cookieStr.trim().split("=");
      if (parts.length !== 2) return null;
      const [cookieName, cookieValue] = parts;
      if (!cookieName) return null;
      return {
        name: cookieName,
        value: cookieValue,
      };
    })
    .filter((cookie): cookie is Cookie => cookie !== null);

  const prevCookies = pplxCookiesStore.getState().cookies;

  const hasChanged =
    prevCookies.length !== parsedCookies.length ||
    prevCookies.some(
      (prevCookie, index) =>
        !parsedCookies[index] ||
        prevCookie.name !== parsedCookies[index].name ||
        prevCookie.value !== parsedCookies[index].value,
    );

  if (hasChanged) {
    pplxCookiesStore.setState({ cookies: parsedCookies });
  }
}
