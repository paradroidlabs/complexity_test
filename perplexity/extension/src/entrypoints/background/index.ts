// --- [DO NOT REMOVE] ---
import "webext-bridge/background";
// --- [DO NOT REMOVE] ---

import { setupBackgroundListeners } from "@/entrypoints/background/listeners";
import { registerProxyServices } from "@/entrypoints/background/proxy-services";

registerProxyServices();
setupBackgroundListeners();
