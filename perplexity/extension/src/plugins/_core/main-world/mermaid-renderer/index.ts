import { fromUint8Array } from "js-base64";
import type { MermaidConfig } from "mermaid";
import pako from "pako";
import svgPanZoom from "svg-pan-zoom";

import { setupMermaidRendererListeners } from "@/plugins/_core/main-world/mermaid-renderer/listeners";
import { UiUtils } from "@/utils/ui-utils";
import { injectMainWorldScriptBlock } from "@/utils/utils";
import packageJson from "~/package.json";

declare module "@/plugins/_core/main-world/types" {
  interface MainWorldCorePluginRegistry {
    mermaidRenderer: void;
  }
}

export class MermaidRenderer {
  private static instance: MermaidRenderer | null = null;
  private importPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance() {
    if (!MermaidRenderer.instance) {
      MermaidRenderer.instance = new MermaidRenderer();
    }
    return MermaidRenderer.instance;
  }

  initialize() {
    setupMermaidRendererListeners();
    $(() => this.importMermaid());
  }

  private async importMermaid(): Promise<void> {
    if (!this.importPromise) {
      const scriptContent = `
        import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@${packageJson.devDependencies["mermaid"]}/dist/mermaid.esm.min.mjs';

        window.mermaid = mermaid;
      `;

      this.importPromise = injectMainWorldScriptBlock({
        scriptContent,
        waitForExecution: true,
      }).catch((error) => {
        console.error("Failed to import Mermaid:", error);
        throw error;
      });
    }

    return this.importPromise;
  }

  isInitialized() {
    return this.importPromise?.then(() => true).catch(() => false);
  }

  async handleRenderRequest(
    selector: string,
  ): Promise<{ success: boolean; error?: string }> {
    const $target = $(selector);

    if ($target.length === 0) {
      console.warn("No elements found for rendering Mermaid");
      return {
        success: false,
        error: "No elements found for rendering Mermaid",
      };
    }

    const isRendered = $target.find("svg").length > 0;

    if (isRendered) {
      return {
        success: true,
      };
    }

    try {
      await MermaidRenderer.waitForInitialization();

      const isDarkTheme = UiUtils.isDarkTheme();

      const config: MermaidConfig = {
        startOnLoad: false,
        theme: isDarkTheme ? "dark" : "base",
        gitGraph: {
          useMaxWidth: true,
        },
        fontFamily: "var(--font-fk-grotesk)",
      };

      window.mermaid!.initialize(config);

      if (!$target[0])
        return {
          success: false,
          error: "No elements found for rendering Mermaid",
        };

      await window.mermaid!.run({
        nodes: [$target[0]],
      });

      const $svg = $target.find("svg");

      $svg.css({
        width: "100%",
        maxWidth: "100%",
        height: "100%",
      });

      if (!$svg[0])
        return {
          success: false,
          error: "No SVG element found for rendering Mermaid",
        };

      const svgPanZoomInstance = svgPanZoom($svg[0], {
        center: true,
        fit: true,
        contain: true,
        dblClickZoomEnabled: true,
      });

      $target.on("resetZoom", () => {
        svgPanZoomInstance.resetZoom();
      });

      $target.on("resetPan", () => {
        svgPanZoomInstance.resetPan();
      });

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: (error as any).str,
      };
    }
  }

  async handleGetPlaygroundUrlRequest(code: string) {
    try {
      await MermaidRenderer.waitForInitialization();

      const json = JSON.stringify({
        code,
      });

      const data = new TextEncoder().encode(json);
      const compressed = pako.deflate(data, { level: 9 });
      const encoded = fromUint8Array(compressed, true);

      return `https://mermaidchart.com/play#pako:${encoded}`;
    } catch (e) {
      console.error("[MermaidRenderer] Error getting playground URL:", e);
      return "";
    }
  }

  static async waitForInitialization() {
    while (!MermaidRenderer.getInstance().isInitialized()) {
      await sleep(100);
    }
  }
}

MermaidRenderer.getInstance().initialize();
