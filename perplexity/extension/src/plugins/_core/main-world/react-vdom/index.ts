import { setupReactVdomListeners } from "@/plugins/_core/main-world/react-vdom/listeners";

declare module "@/plugins/_core/main-world/types" {
  interface MainWorldCorePluginRegistry {
    reactVdom: void;
  }
}

onlyMainWorldGuard();

setupReactVdomListeners();
