import { sendMessage } from "webext-bridge/content-script";

import type { TextboxSelection } from "@/utils/textarea-utils";

export function setSelection(
  element: HTMLElement,
  start: number,
  end: number,
): void {
  element.focus();
  if (start > end) {
    [start, end] = [end, start];
  }

  const sel = window.getSelection();
  if (!sel) return;

  function getTextNodesWithOffsets(node: Node) {
    const textNodes: Array<{ node: Node; start: number; end: number }> = [];
    let offset = 0;

    function traverse(n: Node) {
      if (n.nodeType === Node.TEXT_NODE) {
        textNodes.push({
          node: n,
          start: offset,
          end: offset + (n.textContent?.length ?? 0),
        });
        offset += n.textContent?.length ?? 0;
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        if ((n as HTMLElement).tagName === "BR") {
          offset += 1; // Count <br> as newline character
        }

        for (const child of n.childNodes) {
          traverse(child);
        }
      }
    }

    traverse(node);
    return { textNodes, totalLength: offset };
  }

  function getPositionFromOffset(
    textNodes: Array<{ node: Node; start: number; end: number }>,
    targetOffset: number,
  ) {
    if (targetOffset === 0) {
      if (textNodes.length > 0) {
        return { node: textNodes[0]?.node, offset: 0 };
      } else {
        return { node: element, offset: 0 };
      }
    }

    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes[i];
      if (
        targetOffset >= (textNode?.start ?? 0) &&
        targetOffset <= (textNode?.end ?? 0)
      ) {
        return {
          node: textNode?.node,
          offset: targetOffset - (textNode?.start ?? 0),
        };
      }
    }

    if (textNodes.length > 0) {
      const lastNode = textNodes[textNodes.length - 1];
      return {
        node: lastNode?.node ?? element,
        offset: lastNode?.node?.textContent?.length ?? 0,
      };
    }

    return { node: element, offset: 0 };
  }

  const { textNodes } = getTextNodesWithOffsets(element);
  const startPos = getPositionFromOffset(textNodes, start);
  const endPos = getPositionFromOffset(textNodes, end);

  try {
    const range = document.createRange();
    range.setStart(startPos?.node ?? element, startPos?.offset ?? 0);
    range.setEnd(endPos?.node ?? element, endPos?.offset ?? 0);

    sel.removeAllRanges();
    sel.addRange(range);
  } catch (error) {
    console.error("Failed to set selection:", {
      error,
      startPos,
      endPos,
    });
  }
}

export function getSelection(element: HTMLElement): TextboxSelection {
  function getTextNodesWithOffsets(node: Node) {
    const textNodes: { node: Node; start: number; end: number }[] = [];
    let offset = 0;

    function traverse(n: Node) {
      if (n.nodeType === Node.TEXT_NODE) {
        const length = n.textContent?.length ?? 0;
        textNodes.push({ node: n, start: offset, end: offset + length });
        offset += length;
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        if ((n as Element).tagName === "BR") {
          offset += 1;
        }

        for (const child of n.childNodes) {
          traverse(child);
        }
      }
    }

    traverse(node);
    return { textNodes, totalLength: offset };
  }

  function getOffsetFromPosition(
    textNodes: { node: Node; start: number; end: number }[],
    targetNode: Node,
    targetOffset: number,
  ) {
    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes[i];
      if (textNode?.node === targetNode) {
        return textNode?.start + targetOffset;
      }
    }
    return 0;
  }

  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) {
    return {
      start: 0,
      end: 0,
      value: element.innerText.replace(/^\n\s/, "") ?? "",
    };
  }

  const range = sel.getRangeAt(0);
  const { textNodes } = getTextNodesWithOffsets(element);

  const start = getOffsetFromPosition(
    textNodes,
    range.startContainer,
    range.startOffset,
  );
  const end = getOffsetFromPosition(
    textNodes,
    range.endContainer,
    range.endOffset,
  );

  return {
    start,
    end,
    value: element.innerText.replace(/^\n\s/, "") ?? "",
  };
}

export function insertText(
  element: HTMLElement,
  text: string,
  position?: number,
): void {
  function insertTextAtPosition(
    originalText: string,
    insertText: string,
    position: number,
  ): string {
    const beforeInsertion = originalText.substring(0, position);
    const afterInsertion = originalText.substring(position);
    return beforeInsertion + insertText + afterInsertion;
  }

  element.focus();

  requestAnimationFrame(() => {
    const newValue = insertTextAtPosition(
      element.innerText,
      text,
      position ?? element.innerText.length,
    );

    sendMessage(
      "reactVdom:setLexicalEditorContent",
      { content: newValue },
      "window",
    ).then(() => {
      const newCaretPos = (position ?? element.innerText.length) + text.length;
      setSelection(element, newCaretPos, newCaretPos);
    });
  });
}

export function deleteSelectedText(_element: HTMLElement): void {
  document.execCommand("insertText", false, "");
}

export function scrollIntoCaretView(_element: HTMLElement): void {
  const sel = window.getSelection();
  if (sel?.rangeCount == null) return;
  const range = sel.getRangeAt(0);
  const node = range.startContainer;
  const parentElement = node.nodeType === 3 ? node.parentNode : node;
  if (parentElement instanceof HTMLElement) {
    parentElement.scrollIntoView({ block: "nearest", inline: "nearest" });
  }
}

export function getWordAtCaret(element: HTMLElement) {
  const { start, end, value: text } = getSelection(element);

  if (start !== end) {
    return { value: text.substring(start, end), start, end };
  }

  // Find the start of the word
  let wordStart = start;
  while (wordStart > 0 && !/\s/.test(text[wordStart - 1]!)) {
    wordStart--;
  }

  // Find the end of the word
  let wordEnd = start;
  while (wordEnd < text.length && !/\s/.test(text[wordEnd]!)) {
    wordEnd++;
  }

  if (wordStart === wordEnd) {
    return { value: "", start: wordStart, end: wordEnd };
  }

  return {
    value: text.substring(wordStart, wordEnd),
    start: wordStart,
    end: wordEnd,
  };
}
