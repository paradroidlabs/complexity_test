import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/main-world/spa-router/listeners.loader";
import hideUnnecessaryButtonsCss from "@/plugins/thread-better-message-toolbars/hide-unnecessary-buttons.css?inline";
import normalizeCss from "@/plugins/thread-better-message-toolbars/normalize.css?inline";
import stickyCss from "@/plugins/thread-better-message-toolbars/sticky.css?inline";
import { setupStickyToolbars } from "@/plugins/thread-better-message-toolbars/stuck-toolbar-observer";
import { ExtensionSettingsService } from "@/services/extension-settings";
import { insertCss, whereAmI } from "@/utils/utils";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:thread:betterMessageToolbars": void;
  }
}

let cleanup: (() => void) | null = null;

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:thread:betterMessageToolbars",
    dependencies: [
      "cache:pluginsStates",
      "coreDomObserver:thread:messageBlocks",
    ],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      if (!pluginsStates["thread:betterMessageToolbars"]) return;

      betterMessageToolbars(whereAmI());

      spaRouteChangeCompleteSubscribe((url) => {
        betterMessageToolbars(whereAmI(url));
      });
    },
  });
}

function betterMessageToolbars(location: ReturnType<typeof whereAmI>) {
  cleanup?.();

  if (location !== "thread") return;

  const settings = ExtensionSettingsService.cachedSync;

  const cleanupFunctions: Array<() => void> = [];

  cleanupFunctions.push(
    insertCss({
      css: normalizeCss,
      id: "better-message-toolbars-normalize",
    }),
  );

  if (settings?.plugins["thread:betterMessageToolbars"].sticky) {
    cleanupFunctions.push(
      insertCss({
        css: stickyCss,
        id: "better-message-toolbars-sticky",
      }),
    );

    cleanupFunctions.push(setupStickyToolbars());
  }

  if (
    settings?.plugins["thread:betterMessageToolbars"].hideUnnecessaryButtons
  ) {
    cleanupFunctions.push(
      insertCss({
        css: hideUnnecessaryButtonsCss,
        id: "hide-unnecessary-buttons",
      }),
    );
  }

  cleanup = () => {
    cleanupFunctions.forEach((fn) => fn());
  };
}
