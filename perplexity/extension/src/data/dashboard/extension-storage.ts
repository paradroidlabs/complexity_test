export const EXTENSION_ICON_ACTIONS = ["dashboard", "perplexity"] as const;

export const EXTENSION_ICON_ACTIONS_LABEL: Record<
  (typeof EXTENSION_ICON_ACTIONS)[number],
  string
> = {
  dashboard: "Open extension's Settings Dashboard",
  perplexity: "Open a new instance of perplexity.ai",
};
