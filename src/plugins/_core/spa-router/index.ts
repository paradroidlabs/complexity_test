import { setupSpaRouterListeners } from "@/plugins/_core/spa-router/listeners.main-world";
import { proxyNextRouter } from "@/plugins/_core/spa-router/spa-router";
import { waitForNextjsGlobalObj } from "@/plugins/_core/spa-router/utils";

onlyMainWorldGuard();

await waitForNextjsGlobalObj();

proxyNextRouter();
setupSpaRouterListeners();
