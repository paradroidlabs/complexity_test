import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import hideGetMobileAppCtaBtnCss from "@/plugins/hide-get-mobile-app-cta-btn/styles.css?inline";
import { insertCss } from "@/utils/utils";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:hideGetMobileAppCtaBtn": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:hideGetMobileAppCtaBtn",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["hide-get-mobile-app-cta-btn"]) return;

      insertCss({
        css: hideGetMobileAppCtaBtnCss,
        id: "hide-get-mobile-app-cta-btn",
      });
    },
  });
}
