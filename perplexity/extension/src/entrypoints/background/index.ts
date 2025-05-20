// --- [DO NOT REMOVE] ---
import "webext-bridge/background";
// --- [DO NOT REMOVE] ---

import { setupBackgroundListeners } from "@/entrypoints/background/listeners";
import {
  registerIndexedDbProxyServices,
  registerProxyServices,
} from "@/entrypoints/background/proxy-services";

registerProxyServices();
registerIndexedDbProxyServices();
setupBackgroundListeners();
