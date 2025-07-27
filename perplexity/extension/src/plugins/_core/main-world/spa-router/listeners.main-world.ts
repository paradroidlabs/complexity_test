import { onMessage } from "webext-bridge/window";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "spaRouter:push": ({ url }: { url: string }) => void;
    "spaRouter:replace": ({ url }: { url: string }) => void;
    "spaRouter:openInNewTab": ({ url }: { url: string }) => void;
  }
}

export function setupSpaRouterListeners() {
  onMessage("spaRouter:push", ({ data: { url } }) => {
    window.history.pushState({}, "", url);
  });

  onMessage("spaRouter:replace", ({ data: { url } }) => {
    window.history.replaceState({}, "", url);
  });

  onMessage("spaRouter:openInNewTab", ({ data: { url } }) => {
    window.open(url, "_blank");
  });
}
