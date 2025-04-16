import { globalCssStore } from "@/plugins/_core/global-stores/global-css-store";
import followUpQueryBoxCss from "@/plugins/_core/ui/groups/query-box/follow-up-query-box.css?inline";
import mainQueryBoxCss from "@/plugins/_core/ui/groups/query-box/main-query-box.css?inline";

declare module "@/plugins/_core/global-stores/global-css-store" {
  interface GlobalCssStoreRegistry {
    "normalize-main-query-box": void;
    "normalize-follow-up-query-box": void;
  }
}

export default function loader() {
  globalCssStore.getState().registerCssEntry({
    css: mainQueryBoxCss,
    id: "normalize-main-query-box",
  });
  globalCssStore.getState().registerCssEntry({
    css: followUpQueryBoxCss,
    id: "normalize-follow-up-query-box",
  });
}
