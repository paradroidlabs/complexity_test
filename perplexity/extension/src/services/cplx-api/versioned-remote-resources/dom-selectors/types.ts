import { z } from "zod";

export const DomSelectorsSchema = z.object({
  SIDEBAR: z.object({
    WRAPPER: z.string(),
  }),
  THREAD: z.object({
    NAVBAR: z.string(),
    PAGE_WRAPPER: z.string(),
    WRAPPER: z.string(),
    CONTAINER: z.object({
      DESKTOP: z.object({
        NORMAL: z.string(),
        BRANCHED: z.string(),
      }),
      MOBILE: z.object({
        NORMAL: z.string(),
        BRANCHED: z.string(),
      }),
    }),
    MESSAGE: z.object({
      OUTER_WRAPPER: z.string(),
      INNER_WRAPPER: z.string(),
      QUERY_WRAPPER: z.string(),
      QUERY: z.string(),
      QUERY_HOVER_CONTAINER: z.string(),
      QUERY_HOVER_CONTAINER_CHILD: z.object({
        EDIT_QUERY_BUTTON: z.string(),
      }),
      STICKY_HEADER: z.string(),
      SOURCES: z.string(),
      ANSWER: z.string(),
      BOTTOM_BAR: z.string(),
      BOTTOM_BAR_CHILD: z.object({
        REWRITE_BUTTON: z.string(),
        COPY_BUTTON: z.string(),
        THUMBS_DOWN_BUTTON: z.string(),
        MISC_BUTTON: z.string(),
      }),
      IMAGE_GEN: z.object({
        OPTIONS_GRID: z.string(),
      }),
      CODE_BLOCK: z.object({
        WRAPPER: z.string(),
        NATIVE_HEADER: z.string(),
        NATIVE_COPY_BUTTON: z.string(),
      }),
    }),
    POPPER: z.object({
      DESKTOP: z.string(),
    }),
  }),
  HOME: z.object({
    SLOGAN: z.string(),
    BOTTOM_BAR: z.string(),
    LANGUAGE_SELECTOR: z.string(),
  }),
  QUERY_BOX: z.object({
    TEXTAREA: z.object({
      MAIN: z.string(),
      SPACE: z.string(),
      FOLLOW_UP: z.string(),
      ARBITRARY: z.string(),
    }),
    COMPONENTS_WRAPPER: z.object({
      LEFT_WRAPPER: z.string(),
      LEFT_COMPONENTS_WRAPPER: z.string(),
      RIGHT_WRAPPER: z.string(),
      RIGHT_COMPONENTS_WRAPPER: z.string(),
    }),
    ATTACH_BUTTON: z.string(),
    SUBMIT_BUTTON: z.string(),
    FORK_BUTTON: z.string(),
    WRAPPER: z.string(),
    PRO_SEARCH_TOGGLE: z.string(),
    INCOGNITO_TOGGLE: z.string(),
  }),
  SETTINGS_PAGE: z.object({
    SIDEBAR_WRAPPER: z.string(),
    SIDEBAR_CHILD: z.object({
      BACK_BUTTON: z.string(),
    }),
  }),
  STICKY_NAVBAR: z.string(),
  SICKY_NAVBAR_CHILD: z.object({
    THREAD_TITLE_WRAPPER: z.string(),
    THREAD_TITLE: z.string(),
    THREAD_TITLE_INPUT: z.string(),
    OVERFLOW_MENU_BUTTON_WRAPPER: z.string(),
  }),
});

export type DomSelectors = z.infer<typeof DomSelectorsSchema>;
