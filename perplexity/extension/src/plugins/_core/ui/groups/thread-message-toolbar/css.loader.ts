import { globalCssStore } from "@/plugins/_core/global-stores/global-css-store";
import hideNativeButtonsCss from "@/plugins/thread-better-message-copy-buttons/hide-native-buttons.css?inline";
import hideNativeRewriteDropdownsCss from "@/plugins/thread-better-rewrite-dropdown/hide-native-rewrite-dropdowns.css?inline";

declare module "@/plugins/_core/global-stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "thread-message-toolbar-hide-native-copy-buttons": void;
    "thread-message-toolbar-hide-native-rewrite-dropdowns": void;
  }
}

export default function loader() {
  globalCssStore.getState().registerCssEntry({
    id: "thread-message-toolbar-hide-native-copy-buttons",
    css: hideNativeButtonsCss,
  });
  globalCssStore.getState().registerCssEntry({
    id: "thread-message-toolbar-hide-native-rewrite-dropdowns",
    css: hideNativeRewriteDropdownsCss,
  });
}
