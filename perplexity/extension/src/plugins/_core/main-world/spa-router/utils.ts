import type { MaybePromise } from "@/types/utils.types";
import { DOM_SELECTORS } from "@/utils/dom-selectors";
import { UiUtils } from "@/utils/ui-utils";
import type { whereAmI } from "@/utils/utils";

export async function waitForNextjsGlobalObj(): Promise<void> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      if (window.next?.router !== undefined) {
        $(document.body).attr("data-nextjs-router-ready", "");
        clearInterval(interval);
        resolve();
      }
    }, 100);
  });
}

export function isNextWindowObjectExists() {
  return window.next !== undefined;
}

export function applyRouteIdAttrs(location: ReturnType<typeof whereAmI>) {
  $(document.body).attr("location", location);
}

export async function waitForRouteChangeComplete(
  location: ReturnType<typeof whereAmI>,
) {
  const locationChecks: Partial<
    Record<ReturnType<typeof whereAmI>, () => MaybePromise<boolean>>
  > = {
    thread: checkThreadLoaded,
    home: checkHomeLoaded,
  };

  const check = locationChecks[location] ?? UiUtils.waitForSpaIdle;

  await waitForConditionOrTimeout(check);

  applyRouteIdAttrs(location);

  async function checkThreadLoaded() {
    await UiUtils.waitForSpaIdle();
    return $(DOM_SELECTORS.THREAD.MESSAGE.INNER_WRAPPER).length > 0;
  }

  function checkHomeLoaded() {
    return $(DOM_SELECTORS.HOME.SLOGAN).length > 0;
  }

  async function waitForConditionOrTimeout(
    condition: () => MaybePromise<boolean>,
    timeout = 3000,
    interval = 100,
  ) {
    let timeoutReached = false;

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => {
        timeoutReached = true;
        resolve(undefined);
      }, timeout);
    });

    const checkCondition = async () => {
      while (!timeoutReached && !(await condition())) {
        await sleep(interval);
      }
    };

    await Promise.race([checkCondition(), timeoutPromise]);
  }
}
