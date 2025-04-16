import { setupSpaRouterListeners } from "@/plugins/_core/main-world/spa-router/listeners.main-world";
import { proxyNextRouter } from "@/plugins/_core/main-world/spa-router/spa-router";
import { waitForNextjsGlobalObj } from "@/plugins/_core/main-world/spa-router/utils";

declare module "@/plugins/_core/main-world/types" {
  interface MainWorldCorePluginRegistry {
    spaRouter: void;
  }
}

onlyMainWorldGuard();

await waitForNextjsGlobalObj();

proxyNextRouter();
setupSpaRouterListeners();
