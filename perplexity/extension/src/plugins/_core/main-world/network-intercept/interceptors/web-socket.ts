import { sendMessage } from "webext-bridge/window";

const capturedInstances: Set<WebSocket> = new Set();
const webSocketOriginalSend = WebSocket.prototype.send;

function isValidWebSocketInstance(instance: WebSocket): boolean {
  return instance?.readyState === WebSocket.OPEN;
}

function setWebSocketInstance(instance: WebSocket) {
  if (!isValidWebSocketInstance(instance)) return;

  capturedInstances.add(instance);
  proxyWebSocketInstance(instance);
}

function proxyWebSocketInstance(instance: WebSocket) {
  const originalMessage = instance.onmessage;
  instance.onmessage = (event: MessageEvent) => {
    if (typeof event.data === "string") {
      sendMessage(
        "network-intercept:webSocketEvent",
        {
          event: "message",
          payload: {
            url: instance.url,
            data: event.data,
          },
        },
        "content-script",
      );
    }

    if (originalMessage) originalMessage.call(instance, event);
  };
}

function passivelyCaptureWebSocket() {
  WebSocket.prototype.send = async function (data) {
    if (!capturedInstances.has(this)) {
      setWebSocketInstance(this);
    }

    if (typeof data === "string") {
      const resp = await sendMessage(
        "network-intercept:webSocketEvent",
        {
          event: "send",
          payload: {
            url: this.url,
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
    } else if (data instanceof Blob) {
      try {
        const arrayBuffer = await data.arrayBuffer();
        const binaryData = Array.from(new Uint8Array(arrayBuffer));
        data = new Blob([new Uint8Array(binaryData)], {
          type: data.type,
        });
      } catch (error) {
        console.error("Failed to process Blob data:", error);
      }
    }

    return webSocketOriginalSend.apply(this, [data]);
  };
}

export function initWebSocketInterceptor() {
  passivelyCaptureWebSocket();
}
