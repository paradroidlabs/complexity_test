const OBSERVER_IDS = [
  "colorScheme",
  "pplxCookies",

  "sidebar:wrapper",

  "queryBoxes",
  "queryBoxes:home",
  "queryBoxes:collection",
  "queryBoxes:followUp",
  "queryBoxes:modal",
  "queryBoxes:$pplxComponentsWrapper",

  "home",
  "home:languageSelector",

  "thread",
  "thread:messageBlocks",
  "thread:codeBlocks",
  "thread:tocSidebarObserver",

  "spacesPage",

  "settingsPage:topNavWrapper",

  "plugin:queryBox:languageModelSelector:syncNativeModelSelector",
] as const;

export type ObserverId = (typeof OBSERVER_IDS)[number];
