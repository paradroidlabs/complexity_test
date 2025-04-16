import { UiUtils } from "@/utils/ui-utils";

type TextareaSelection = {
  start: number;
  end: number;
  value: string;
};

export const getActiveTextarea = (): HTMLTextAreaElement | null => {
  return UiUtils.getActiveQueryBoxTextarea()[0] ?? null;
};

export const setTextareaSelection = (
  textarea: HTMLTextAreaElement,
  start: number,
  end: number,
): void => {
  textarea.focus();
  textarea.setSelectionRange(start, end);
};

export const getTextareaSelection = (
  textarea: HTMLTextAreaElement,
): TextareaSelection => ({
  start: textarea.selectionStart,
  end: textarea.selectionEnd,
  value: textarea.value,
});

export const insertText = (
  textarea: HTMLTextAreaElement,
  text: string,
): void => {
  textarea.focus();
  document.execCommand("insertText", false, text);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
};

export const deleteSelectedText = (textarea: HTMLTextAreaElement): void => {
  textarea.focus();
  document.execCommand("delete", false, undefined);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
};
