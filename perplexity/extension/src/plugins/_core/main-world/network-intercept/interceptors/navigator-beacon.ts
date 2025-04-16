import { sendMessage } from "webext-bridge/window";

import type { BeaconEventDataCatalog } from "@/plugins/_core/main-world/network-intercept/listeners.types";

export function initBeaconInterceptor() {
  const originalSendBeacon = navigator.sendBeacon;

  navigator.sendBeacon = function (url: URL, data?: BodyInit | null) {
    if (data == null || (typeof data !== "string" && !(data instanceof Blob))) {
      return originalSendBeacon.call(navigator, url, data);
    }

    const urlString = url.toString();

    const handleData = (stringData: string) => {
      sendMessage(
        "network-intercept:beaconEvent",
        {
          event: "request",
          payload: { url: urlString, data: stringData },
        },
        "content-script",
      )
        .then((resp) => {
          resp = resp as BeaconEventDataCatalog["request"]["payload"];

          if (resp?.data === "") return;

          if (resp?.data && resp.data !== stringData) {
            data =
              data instanceof Blob
                ? new Blob([resp.data], { type: data.type })
                : resp.data;
          }

          const result = originalSendBeacon.call(navigator, url, data);
          sendMessage(
            "network-intercept:beaconEvent",
            {
              event: "response",
              payload: {
                url: urlString,
                success: result,
              },
            },
            "content-script",
          );
        })
        .catch(() => {
          const result = originalSendBeacon.call(navigator, url, data);
          sendMessage(
            "network-intercept:beaconEvent",
            {
              event: "response",
              payload: {
                url: urlString,
                success: result,
              },
            },
            "content-script",
          );
        });
    };

    if (typeof data === "string") {
      handleData(data);
    } else {
      data
        .text()
        .then(handleData)
        .catch(() => {
          originalSendBeacon.call(navigator, url, data);
        });
    }

    return true;
  };
}
