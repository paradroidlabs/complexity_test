import { sendMessage } from "webext-bridge/window";

export function initFetchInterceptor() {
  const originalFetch = window.fetch;

  window.fetch = async function (input: RequestInfo | URL, init?: RequestInit) {
    if (init?.body == null || typeof init.body !== "string") {
      return originalFetch.call(window, input, init);
    }

    const modifiedBody = await interceptRequest(input, init.body);
    if (modifiedBody) {
      init.body = modifiedBody;
    }

    const response = await originalFetch.call(window, input, init);
    const url = constructUrl(input);

    if (response.headers.get("content-type")?.includes("text/event-stream")) {
      return handleStreamingResponse(response, url);
    }

    return handleRegularResponse(response, url);
  };
}

async function interceptRequest(input: RequestInfo | URL, body: string) {
  const resp = await sendMessage(
    "network-intercept:fetchEvent",
    {
      event: "request",
      payload: {
        url: constructUrl(input),
        data: body,
      },
    },
    "content-script",
  );
  return resp?.data;
}

function handleStreamingResponse(response: Response, url: string) {
  const reader = response.body?.getReader();
  if (!reader) return response;

  const decoder = new TextDecoder();

  return new Response(
    new ReadableStream({
      async start(controller) {
        try {
          let result = await reader.read();
          while (!result.done) {
            const chunk = decoder.decode(result.value, { stream: true });
            await notifyContentScript(url, response.status, chunk);
            controller.enqueue(result.value);
            result = await reader.read();
          }
          controller.close();
        } catch (error) {
          controller.error(error);
          reader.cancel();
        }
      },
    }),
    {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    },
  );
}

async function handleRegularResponse(response: Response, url: string) {
  const clonedResponse = response.clone();
  const body = await clonedResponse.text();
  await notifyContentScript(url, response.status, body);
  return response;
}

async function notifyContentScript(url: string, status: number, data: string) {
  await sendMessage(
    "network-intercept:fetchEvent",
    {
      event: "response",
      payload: { url, status, data },
    },
    "content-script",
  );
}

function constructUrl(url: unknown) {
  if (url instanceof URL) return url.href;
  if (typeof url === "string") return url;
  return "";
}
