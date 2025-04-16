import { setNamespace } from "webext-bridge/window";

onlyMainWorldGuard();

setNamespace("com.complexity");
