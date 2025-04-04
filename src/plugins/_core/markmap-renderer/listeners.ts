import { onMessage } from "webext-bridge/window";

import { MarkmapRenderer } from "@/plugins/_core/markmap-renderer/index";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "markmapRenderer:isInitialized": () => boolean;
    "markmapRenderer:render": (params: {
      content: string;
      selector: string;
    }) => {
      success: boolean;
      error?: string;
    };
    "markmapRenderer:openAsInteractiveHtml": (params: {
      content: string;
    }) => void;
    "markmapRenderer:downloadAsInteractiveHtml": (params: {
      content: string;
      title: string;
    }) => void;
  }
}

export function setupMarkmapRendererListeners() {
  onMessage(
    "markmapRenderer:isInitialized",
    () => MarkmapRenderer.getInstance()?.isInitialized() ?? false,
  );

  onMessage("markmapRenderer:render", ({ data: { content, selector } }) => {
    return MarkmapRenderer.getInstance().handleRenderRequest({
      content,
      selector,
    });
  });

  onMessage(
    "markmapRenderer:openAsInteractiveHtml",
    ({ data: { content } }) => {
      return MarkmapRenderer.openAsInteractiveHtml({
        content,
      });
    },
  );

  onMessage(
    "markmapRenderer:downloadAsInteractiveHtml",
    ({ data: { content, title } }) => {
      return MarkmapRenderer.downloadAsInteractiveHtml({
        content,
        title,
      });
    },
  );
}
