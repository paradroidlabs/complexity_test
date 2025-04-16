import {
  CANVAS_INTERPRETED_LANGUAGES,
  CANVAS_LANGUAGES,
} from "@/plugins/canvas/canvases";

export type CanvasLanguage = keyof typeof CANVAS_LANGUAGES;

export type CanvasState = "preview" | "code";

export const isCanvasLanguageString = (
  languageString: string | null | undefined,
): languageString is CanvasLanguage => {
  if (languageString == null) return false;

  return (
    languageString in CANVAS_LANGUAGES ||
    languageString in CANVAS_INTERPRETED_LANGUAGES
  );
};

export const isAutonomousCanvasLanguageString = (
  languageString: string | null | undefined,
): boolean => {
  if (languageString == null) return false;

  if (!languageString.startsWith("canvas:")) return false;

  const language = languageString.split(":")[1];

  if (!language) return false;

  return isCanvasLanguageString(language);
};

export const getInterpretedCanvasLanguage = (
  languageString: string,
): CanvasLanguage | string => {
  if (isCanvasLanguageString(languageString))
    return (
      CANVAS_LANGUAGES[languageString] ??
      CANVAS_INTERPRETED_LANGUAGES[languageString]
    );

  if (isAutonomousCanvasLanguageString(languageString))
    return languageString.split(":")[1] ?? languageString;

  return languageString;
};

export const getCanvasTitle = (languageString: string | undefined | null) => {
  if (!languageString) return "";
  if (!isAutonomousCanvasLanguageString(languageString)) return "";
  return languageString.split(":")[2] ?? "";
};

export const formatCanvasTitle = (title: string) => {
  return title
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
