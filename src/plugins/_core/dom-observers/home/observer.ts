import { CallbackQueue } from "@/plugins/_api/dom-observer/callback-queue";
import { DomObserver } from "@/plugins/_api/dom-observer/dom-observer";
import {
  findBottomBar,
  findSlogan,
  observeLanguageSelector,
} from "@/plugins/_core/dom-observers/home/utils";
import { shouldEnableCoreObserver } from "@/plugins/_core/dom-observers/utils";
import { spaRouteChangeCompleteSubscribe } from "@/plugins/_core/spa-router/listeners";
import { csLoaderRegistry } from "@/utils/cs-loader-registry";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { whereAmI } from "@/utils/utils";

csLoaderRegistry.register({
  id: "coreDomObserver:home",
  dependencies: ["messaging:spaRouter"],
  loader: () => {
    // this observer is always needed for update announcer

    // if (
    //   !shouldEnableCoreObserver({
    //     coreObserverId: "coreDomObserver:home",
    //   })
    // )
    //   return;

    observeHome(whereAmI());

    spaRouteChangeCompleteSubscribe((url) => {
      observeHome(whereAmI(url));
    });
  },
});

const cleanup = () => {
  DomObserver.destroy("home");
  DomObserver.destroy("home:languageSelector");
};

function observeHome(location: ReturnType<typeof whereAmI>) {
  cleanup();

  if (location !== "home") return;

  DomObserver.create("home", {
    target: document.body,
    config: { childList: true, subtree: true },
    onMutation: () =>
      CallbackQueue.getInstance().enqueueArray([
        { callback: findSlogan, id: "home:slogan" },
        {
          callback: findBottomBar,
          id: "home:bottomBar",
        },
      ]),
  });

  const $languageSelector = $(DOM_SELECTORS.HOME.LANGUAGE_SELECTOR);

  if (!$languageSelector[0]) return;

  DomObserver.create("home:languageSelector", {
    target: $languageSelector[0],
    config: { attributes: true, attributeFilter: ["aria-label"] },
    onMutation: () =>
      CallbackQueue.getInstance().enqueue(
        observeLanguageSelector,
        "home:languageSelector",
      ),
  });
}
