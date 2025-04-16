import type { QueryBoxType } from "@/data/plugins/query-box/types";
import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { DOM_SELECTORS } from "@/utils/dom-selectors";

export class UiUtils {
  static isDarkTheme() {
    return $("html").attr("data-color-scheme") === "dark";
  }

  static getMessagesContainer() {
    const isMobile = isMobileStore.getState().isMobile;

    let $messagesContainer = $(
      isMobile
        ? DOM_SELECTORS.THREAD.CONTAINER.MOBILE.NORMAL
        : DOM_SELECTORS.THREAD.CONTAINER.DESKTOP.NORMAL,
    );

    if (!$messagesContainer.length) {
      $messagesContainer = $(
        isMobile
          ? DOM_SELECTORS.THREAD.CONTAINER.MOBILE.BRANCHED
          : DOM_SELECTORS.THREAD.CONTAINER.DESKTOP.BRANCHED,
      );
    }

    return $messagesContainer;
  }

  static getActiveQueryBoxTextarea({
    type,
  }: {
    type?: QueryBoxType;
  } = {}): JQuery<HTMLTextAreaElement> {
    if (!type) return $(`${DOM_SELECTORS.QUERY_BOX.TEXTAREA.ARBITRARY}:last`);

    const selectorMap: Record<QueryBoxType, string> = {
      main: DOM_SELECTORS.QUERY_BOX.TEXTAREA.MAIN,
      space: DOM_SELECTORS.QUERY_BOX.TEXTAREA.SPACE,
      "follow-up": DOM_SELECTORS.QUERY_BOX.TEXTAREA.FOLLOW_UP,
    };

    return $(selectorMap[type]);
  }

  static getActiveQueryBox({ type }: { type?: QueryBoxType } = {}) {
    return UiUtils.getActiveQueryBoxTextarea({
      type,
    })
      .parents(DOM_SELECTORS.QUERY_BOX.WRAPPER)
      .first();
  }

  static getStickyNavbar() {
    return $(DOM_SELECTORS.STICKY_NAVBAR);
  }

  static getWordOnCaret(element: HTMLTextAreaElement) {
    const text = element.value;
    const caret = element.selectionStart;

    if (!text || caret === undefined) {
      return {
        word: "",
        start: 0,
        end: 0,
        newText: "",
      };
    }

    // Find the start of the word
    let start = text.slice(0, caret).search(/\S+$/);
    if (start === -1) {
      start = caret;
    }

    // Find the end of the word
    let end = text.slice(caret).search(/\s/);
    if (end === -1) {
      end = text.length;
    } else {
      end += caret;
    }

    const word = text.slice(start, end);
    const newText = text.slice(0, start) + text.slice(end);

    return {
      word,
      start,
      end,
      newText,
    };
  }

  static waitForSpaIdle(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      // const startTime = Date.now();
      // console.log("waitForSpaIdle: Start waiting for SPA to become idle.");

      const $wrapper = $(document.body);
      if (!$wrapper[0]) {
        // console.log("waitForSpaIdle: No wrapper found, resolving immediately.");
        return resolve(true);
      }

      const IDLE_TIME = 50;
      const IDLE_TIMEOUT = 3000;

      let timeout: NodeJS.Timeout;
      let isIdle = false;

      function mutationDisconnect() {
        if (isIdle) return;
        isIdle = true;

        observer.disconnect();
        // const endTime = Date.now();
        // console.log(
        //   `waitForSpaIdle: SPA became idle after ${endTime - startTime} ms.`,
        // );

        resolve(true);
      }

      function mutationFn() {
        clearTimeout(timeout);
        timeout = setTimeout(mutationDisconnect, IDLE_TIME);
      }

      const observer = new MutationObserver(mutationFn);

      observer.observe($wrapper[0], {
        childList: true,
        subtree: false,
      });

      mutationFn();

      setTimeout(() => {
        if (isIdle) return;
        console.log(
          "[WaitForSpaIdle] Timeout reached, disconnecting observer.",
        );
        observer.disconnect();
        resolve(true);
      }, IDLE_TIMEOUT);
    });
  }

  static scrollIntoCaretView(textarea: HTMLTextAreaElement) {
    const currentCaretPosition = textarea.selectionStart;

    $(textarea).trigger("blur");
    $(textarea).trigger("focus");

    textarea.selectionStart = currentCaretPosition;
    textarea.selectionEnd = currentCaretPosition;
  }
}
