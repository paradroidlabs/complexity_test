export const CALLBACK_QUEUE_TASK_IDS = [
  "home",
  "home:slogan",
  "home:bottomBar",
  "home:languageSelector",

  "sidebar:wrapper",
  "sidebar:spaceButtonWrapper",
  "sidebar:spaceButtonTriggerButtonsWrapper",
  "sidebar:libraryButtonWrapper",
  "sidebar:libraryButtonTriggerButtonsWrapper",

  "queryBoxes",
  "queryBoxes:home",
  "queryBoxes:collection",
  "queryBoxes:followUp",
  "queryBoxes:modal",
  "queryBoxes:pplxComponentsWrapper",

  "thread",
  "thread:navbar",
  "thread:navbar:navbarOverflowMenuButton",
  "thread:messageStickyHeaderHeight",
  "thread:pageWrapper",
  "thread:wrapper",
  "thread:popper",
  "thread:messageBlocks",
  "thread:codeBlocks",
  "thread:tocSidebarObserver",

  "spacesPage:spaceCard",

  "settingsPage:topNavWrapper",
] as const;

export type CallbackQueueTaskId = (typeof CALLBACK_QUEUE_TASK_IDS)[number];
