import { locationWaits } from "@/plugins/_core/main-world/spa-router/location-waits";
import type { MaybePromise } from "@/types/utils.types";
import { UiUtils } from "@/utils/ui-utils";
import { isInContentScript, type whereAmI } from "@/utils/utils";

export function applyRouteIdAttribute(location: ReturnType<typeof whereAmI>) {
  $(document.body).attr("location", location);
}

export async function waitForRouteChangeComplete(
  location: ReturnType<typeof whereAmI>,
) {
  const check = locationWaits[location] ?? UiUtils.waitForSpaIdle;

  await waitForConditionOrTimeout(check);

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

export async function softNavigate(url: string) {
  if (!isInContentScript()) {
    window.history.pushState({}, "", url);
  } else {
    const { sendMessage } = await import("webext-bridge/content-script");
    sendMessage("spaRouter:push", { url }, "window");
  }
}

export async function openInNewTab(url: string) {
  if (!isInContentScript()) {
    window.open(url, "_blank");
  } else {
    const { sendMessage } = await import("webext-bridge/content-script");
    sendMessage("spaRouter:openInNewTab", { url }, "window");
  }
}
