import type * as markmapLib from "markmap-lib";
import type { Transformer } from "markmap-lib";
import type * as markmapRender from "markmap-render";
import type * as markmapView from "markmap-view";
import type { Mermaid } from "mermaid";

declare global {
  interface Window {
    next?: {
      appDir: boolean;
      version: string;
      router: {
        back: () => void;
        forward: () => void;
        refresh: () => void;
        replace: (url: string) => void;
        push: (url: string) => void;
        prefetch: (url: string) => void;
      };
    };

    mermaid?: Mermaid;
    markmapLib?: typeof markmapLib;
    markmapView?: typeof markmapView;
    markmapRender?: typeof markmapRender;
    markmapTransformer?: Transformer;
  }
}

export {};
