import type { ComponentType, SVGProps } from "react";
import { BiLogoReact } from "react-icons/bi";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { LuCodeXml } from "react-icons/lu";
import { PiArticleDuotone } from "react-icons/pi";
import { RiMindMap } from "react-icons/ri";

import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import type {
  CanvasLanguage,
  CanvasState,
} from "@/plugins/canvas/canvas.types";
import MarkmapCanvasActionButtonsWrapper from "@/plugins/canvas/components/action-buttons/Markmap/Wrapper";
import MermaidCanvasActionButtonsWrapper from "@/plugins/canvas/components/action-buttons/Mermaid/Wrapper";
import PlantUmlCanvasActionButtonsWrapper from "@/plugins/canvas/components/action-buttons/PlantUml/Wrapper";
import HtmlRenderer from "@/plugins/canvas/components/renderer/Html";
import MarkdownRenderer from "@/plugins/canvas/components/renderer/Markdown";
import MarkmapRenderer from "@/plugins/canvas/components/renderer/Markmap";
import MermaidRenderer from "@/plugins/canvas/components/renderer/Mermaid";
import PlantUmlRenderer from "@/plugins/canvas/components/renderer/PlantUml";
import ReactRenderer from "@/plugins/canvas/components/renderer/React";

export let CANVAS_LANGUAGE_PREVIEW_TOGGLE_TEXT: Record<CanvasLanguage, string> =
  {} as Record<CanvasLanguage, string>;

export let CANVAS_LANGUAGE_RAW_TOGGLE_TEXT: Record<CanvasLanguage, string> =
  {} as Record<CanvasLanguage, string>;

export const CANVAS_INITIAL_STATE: Record<CanvasLanguage, CanvasState> = {
  markdown: "preview",
  mermaid: "code",
  html: "code",
  react: "code",
  plantuml: "code",
  markmap: "preview",
};

type CanvasPlaceholders = Record<
  CanvasLanguage,
  {
    icon: ComponentType<SVGProps<SVGElement>>;
    defaultTitle: string;
    description: string;
  }
>;

export let CANVAS_PLACEHOLDERS: CanvasPlaceholders = {} as CanvasPlaceholders;

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:thread:canvas:codeBlockPlaceholdersData": void;
  }
}

asyncLoaderRegistry.register({
  id: "plugin:thread:canvas:codeBlockPlaceholdersData",
  dependencies: ["lib:i18next"],
  loader: () => {
    CANVAS_LANGUAGE_PREVIEW_TOGGLE_TEXT = {
      markdown: t("plugin-canvas:canvas.toggle.preview"),
      mermaid: t("plugin-canvas:canvas.toggle.preview"),
      html: t("plugin-canvas:canvas.toggle.preview"),
      react: t("plugin-canvas:canvas.toggle.preview"),
      plantuml: t("plugin-canvas:canvas.toggle.preview"),
      markmap: t("plugin-canvas:canvas.toggle.preview"),
    };

    CANVAS_LANGUAGE_RAW_TOGGLE_TEXT = {
      markdown: t("plugin-canvas:canvas.toggle.markdown.raw"),
      mermaid: t("plugin-canvas:canvas.toggle.code"),
      html: t("plugin-canvas:canvas.toggle.code"),
      react: t("plugin-canvas:canvas.toggle.code"),
      plantuml: t("plugin-canvas:canvas.toggle.code"),
      markmap: t("plugin-canvas:canvas.toggle.code"),
    };

    CANVAS_PLACEHOLDERS = {
      markdown: {
        icon: PiArticleDuotone,
        defaultTitle: "Markdown",
        description: t("plugin-canvas:canvas.placeholder.markdown.description"),
      },
      mermaid: {
        icon: LiaProjectDiagramSolid,
        defaultTitle: "Mermaid",
        description: t("plugin-canvas:canvas.placeholder.mermaid.description"),
      },
      html: {
        icon: LuCodeXml,
        defaultTitle: "HTML",
        description: t("plugin-canvas:canvas.placeholder.html.description"),
      },
      react: {
        icon: BiLogoReact,
        defaultTitle: "React",
        description: t("plugin-canvas:canvas.placeholder.react.description"),
      },
      plantuml: {
        icon: LiaProjectDiagramSolid,
        defaultTitle: "PlantUML",
        description: t("plugin-canvas:canvas.placeholder.mermaid.description"),
      },
      markmap: {
        icon: RiMindMap,
        defaultTitle: "Mindmap",
        description: t("plugin-canvas:canvas.placeholder.markmap.description"),
      },
    };
  },
});

export const CANVAS_RENDERER: Record<CanvasLanguage, ComponentType> = {
  mermaid: MermaidRenderer,
  markdown: MarkdownRenderer,
  html: HtmlRenderer,
  react: ReactRenderer,
  plantuml: PlantUmlRenderer,
  markmap: MarkmapRenderer,
};

export const CANVAS_LANGUAGE_ACTION_BUTTONS: Record<
  CanvasLanguage,
  ComponentType | null
> = {
  mermaid: MermaidCanvasActionButtonsWrapper,
  html: null,
  react: null,
  markdown: null,
  plantuml: PlantUmlCanvasActionButtonsWrapper,
  markmap: MarkmapCanvasActionButtonsWrapper,
};
