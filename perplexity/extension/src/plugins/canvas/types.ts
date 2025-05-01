export const CANVAS_LANGUAGES = {
  markdown: "markdown",
  mermaid: "mermaid",
  markmap: "markmap",
  html: "html",
  react: "react",
  plantuml: "plantuml",
} as const satisfies Partial<Record<string, string>>;

export type CanvasLanguage = keyof typeof CANVAS_LANGUAGES;

export type CanvasState = "preview" | "code";
