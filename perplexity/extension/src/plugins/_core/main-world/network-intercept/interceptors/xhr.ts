import { sendMessage } from "webext-bridge/window";

onlyMainWorldGuard();

export function initXhrInterceptor() {
  const originalXHR = window.XMLHttpRequest;

  (window as any).XMLHttpRequest = function () {
    const xhr = new originalXHR();
    let xhrUrl: string;

    const open = xhr.open;
    xhr.open = function (_, url: string) {
      xhrUrl = url;
      // eslint-disable-next-line prefer-rest-params
      return open.apply(this, arguments as any);
    };

    const send = xhr.send;
    xhr.send = async function (data) {
      if (typeof data === "string") {
        const resp = await sendMessage(
          "networkIntercept:xhrEvent",
          {
            event: "request",
            payload: {
              url: xhrUrl,
              data,
            },
          },
          "content-script",
        );

        if (resp != null && typeof resp === "object" && "data" in resp) {
          if (resp.data === "") {
            return;
          }

          data = resp.data;
        }
      }

      return send.apply(this, [data] as any);
    };

    xhr.addEventListener("load", function () {
      sendMessage(
        "networkIntercept:xhrEvent",
        {
          event: "response",
          payload: {
            url: this.responseURL,
            data: this.responseText,
          },
        },
        "content-script",
      );
    });

    return xhr;
  };
}
