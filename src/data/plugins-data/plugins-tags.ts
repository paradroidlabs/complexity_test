export type PluginTagValues = keyof typeof PLUGIN_TAGS;

export type PluginCategory = keyof typeof PLUGIN_CATEGORIES;

export const PLUGIN_CATEGORIES = {
  queryBox: {
    label: "Query Box Utilities",
    description: "Add functionalities/tweaks to the query box",
  },
  thread: {
    label: "Thread Utilities",
    description:
      "Provide extra functionalities, productivity tweaks to the AI conversation thread",
  },
  sidebar: {
    label: "Sidebar Utilities",
    description:
      "Add extra functionalities, productivity tweaks to the sidebar",
  },
  misc: {
    label: "Miscellaneous",
    description: "Personal preferences",
  },
} as const;

export const PLUGIN_TAGS = {
  ui: {
    label: "Appearance",
    description: "UI related plugins",
  },
  ux: {
    label: "Ease of Use",
    description: "UX related plugins",
  },
  desktopOnly: {
    label: "Desktop Only",
    description: "Can only be used on desktop/screen width > 768px",
  },
  slashCommand: {
    label: "Slash Command",
    description: "Plugins that are enabled by typing a slash command",
  },
  privacy: {
    label: "Privacy",
    description: "Privacy related plugins",
  },
  pplxPro: {
    label: "Perplexity Pro",
    description: "Requires an active Perplexity Pro subscription",
  },
  experimental: {
    label: "Experimental",
    description:
      "Experimental plugins. Subject to change or removal without prior notice",
  },
  beta: {
    label: "Beta",
    description: "Official plugins but still in testing/development",
  },
  forFun: {
    label: "For Fun",
    description: "Just for fun!",
  },
  new: {
    label: "New",
    description: "Recently added plugins",
  },
  codeBlockHighPerformanceImpact: {
    label: "⚡",
    description:
      "May have a noticeable impact on performance in large threads with a large amount of code blocks.",
  },
  chromiumOnly: {
    label: "Chromium Only",
    description: "Can only be used on Chromium-based browsers",
  },
} as const;
