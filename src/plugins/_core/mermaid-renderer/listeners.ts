import { onMessage } from "webext-bridge/window";

import { MermaidRenderer } from "@/plugins/_core/mermaid-renderer/index";

declare module "@/types/webext-bridge-overrides" {
  interface EventHandlers {
    "mermaidRenderer:isInitialized": () => boolean;
    "mermaidRenderer:render": (params: { selector: string }) => {
      success: boolean;
      error?: string;
    };
    "mermaidRenderer:getPlaygroundUrl": (params: { code: string }) => string;
  }
}

export function setupMermaidRendererListeners() {
  onMessage(
    "mermaidRenderer:isInitialized",
    () => MermaidRenderer.getInstance()?.isInitialized() ?? false,
  );

  onMessage("mermaidRenderer:render", ({ data: { selector } }) => {
    return MermaidRenderer.getInstance().handleRenderRequest(selector);
  });

  onMessage("mermaidRenderer:getPlaygroundUrl", ({ data: { code } }) => {
    return MermaidRenderer.getInstance().handleGetPlaygroundUrlRequest(code);
  });
}
