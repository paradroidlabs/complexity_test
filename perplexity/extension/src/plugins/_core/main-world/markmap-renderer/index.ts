import throttle from "lodash/throttle";
import type { Markmap } from "markmap-view";

import { setupMarkmapRendererListeners } from "@/plugins/_core/main-world/markmap-renderer/listeners";
import { injectMainWorldScriptBlock } from "@/utils/utils";

declare module "@/plugins/_core/main-world/types" {
  interface MainWorldCorePluginRegistry {
    markmapRenderer: void;
  }
}

export class MarkmapRenderer {
  private static instance: MarkmapRenderer | null = null;
  private importPromise: Promise<void> | null = null;

  private constructor() {}

  private currentMarkmapSvgNode: HTMLElement | null = null;
  private currentMarkmapInstance: Markmap | null = null;

  static getInstance() {
    if (!MarkmapRenderer.instance) {
      MarkmapRenderer.instance = new MarkmapRenderer();
    }
    return MarkmapRenderer.instance;
  }

  initialize() {
    setupMarkmapRendererListeners();
    $(() => this.importMarkmap());
  }

  private async importMarkmap(): Promise<void> {
    if (!this.importPromise) {
      const scriptContent = `
        import * as markmapLib from "https://cdn.jsdelivr.net/npm/markmap-lib/+esm";
        import * as markmapView from "https://cdn.jsdelivr.net/npm/markmap-view/+esm";
        import * as markmapRender from "https://cdn.jsdelivr.net/npm/markmap-render/+esm";

        window.markmapLib = markmapLib;
        window.markmapView = markmapView;
        window.markmapRender = markmapRender;

        const transformer = new markmapLib.Transformer();
        window.markmapTransformer = transformer;
        const { scripts, styles } = transformer.getAssets();
        markmapView.loadCSS(styles);
        markmapView.loadJS(scripts, { getMarkmap: () => markmapView });
      `;

      this.importPromise = injectMainWorldScriptBlock({
        scriptContent,
        waitForExecution: true,
      }).catch((error) => {
        console.error("Failed to import Markmap:", error);
        throw error;
      });
    }

    return this.importPromise;
  }

  isInitialized() {
    return this.importPromise?.then(() => true).catch(() => false);
  }

  handleRenderRequest = throttle(
    async ({
      content,
      selector,
    }: {
      content: string;
      selector: string;
    }): Promise<{ success: boolean; error?: string }> => {
      const $target = $(selector);

      if ($target.length === 0) {
        console.warn("No elements found for rendering Markmap canvas");
        return {
          success: false,
          error: "No elements found for rendering Markmap canvas",
        };
      }

      try {
        await MarkmapRenderer.waitForInitialization();

        const transformer = window.markmapTransformer!;

        const { root } = transformer.transform(content);

        if (!document.body.contains(this.currentMarkmapSvgNode)) {
          const $target = $(selector);

          if (!$target[0])
            return {
              success: false,
              error: "No elements found for rendering Markmap canvas",
            };

          this.currentMarkmapSvgNode = $target[0];

          const { Markmap } = window.markmapView!;

          this.currentMarkmapInstance = Markmap.create(
            selector,
            {
              duration: 50,
              autoFit: true,
            },
            root,
          );
        } else {
          this.currentMarkmapInstance?.setData(root);
          this.currentMarkmapInstance?.fit();
        }

        return {
          success: true,
        };
      } catch (error) {
        return {
          success: false,
          error: (error as any).str,
        };
      }
    },
    500,
    {
      leading: true,
      trailing: true,
    },
  );

  private static getInteractiveHtml({ content }: { content: string }) {
    const fillTemplate = window.markmapRender!.fillTemplate;

    const { root, features } = window.markmapTransformer!.transform(content);
    const assets = window.markmapTransformer!.getUsedAssets(features);

    const html = fillTemplate(root, assets);

    return html;
  }

  static openAsInteractiveHtml({ content }: { content: string }) {
    const html = MarkmapRenderer.getInteractiveHtml({ content });

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  }

  static downloadAsInteractiveHtml({
    content,
    title,
  }: {
    content: string;
    title: string;
  }) {
    const html = MarkmapRenderer.getInteractiveHtml({ content });

    const blob = new Blob([html], { type: "text/html" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title}.html`;
    a.click();
  }

  static async waitForInitialization() {
    while (!MarkmapRenderer.getInstance().isInitialized()) {
      await sleep(100);
    }
  }
}

MarkmapRenderer.getInstance().initialize();
