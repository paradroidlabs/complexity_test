import { onMessage } from "webext-bridge/window";

import { isNextWindowObjectExists } from "@/plugins/_core/spa-router/utils";

export type CsUtilEvents = {
  "spa-router:isNextWindowObjectExists": () => boolean;
  "spa-router:push": ({ url }: { url: string }) => void;
  "spa-router:replace": ({ url }: { url: string }) => void;
  "spa-router:refresh": () => void;
};

export function setupSpaRouterListeners() {
  onMessage("spa-router:isNextWindowObjectExists", () => {
    return isNextWindowObjectExists();
  });

  onMessage("spa-router:push", ({ data: { url } }) => {
    if (!isNextWindowObjectExists())
      throw new Error("Next.js window object not found");

    try {
      window.next?.router.push(url);
    } catch (error) {
      console.error("Error during route change:", error);
    }
  });

  onMessage("spa-router:replace", ({ data: { url } }) => {
    if (!isNextWindowObjectExists())
      throw new Error("Next.js window object not found");

    window.next?.router.replace(url);
  });

  onMessage("spa-router:refresh", () => {
    if (!isNextWindowObjectExists())
      throw new Error("Next.js window object not found");

    window.next?.router.refresh();
  });
}
