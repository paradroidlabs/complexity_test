import type { AnchorSlice } from "@/plugins/slash-command/store/slices/anchor";
import { createTextboxAdapter } from "@/plugins/slash-command/textbox-adapter";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";

function mightBeTextbox(target: HTMLElement): boolean {
  const tagName = target.tagName.toLowerCase();
  const isContentEditable = target.isContentEditable;
  return tagName === "textarea" || isContentEditable;
}

function isQueryBoxTextbox(
  target: HTMLElement,
): target is HTMLTextAreaElement | (HTMLElement & { isContentEditable: true }) {
  if (!mightBeTextbox(target)) return false;

  return Object.entries(DomSelectorsService.cachedSync.QUERY_BOX.TEXTBOX).some(
    ([_, selector]) => target.matches(selector),
  );
}

function isEditQueryBoxTextbox(
  target: HTMLElement,
): target is HTMLTextAreaElement {
  if (!mightBeTextbox(target)) return false;

  return target.matches(
    `${DomSelectorsService.cplxAttribute(
      DomSelectorsService.internalAttributes.THREAD.MESSAGE.QUERY,
    )} textarea`,
  );
}

function createAnchorData(
  target: HTMLElement,
  anchorElement: HTMLElement,
  options: {
    placement: "bottom-start" | "bottom";
    gutter: number;
  },
) {
  return {
    element: anchorElement,
    inputField: target,
    positioningOptions: {
      ...options,
      flip: true,
      hideWhenDetached: true,
      getAnchorRect: () => anchorElement.getBoundingClientRect(),
    },
    contentActions: createTextboxAdapter(target),
  };
}

export function getAnchor(
  target: HTMLElement,
): Pick<
  AnchorSlice["anchor"],
  "element" | "inputField" | "positioningOptions" | "contentActions"
> | null {
  if (isQueryBoxTextbox(target)) {
    const anchor = $(target).closest(
      DomSelectorsService.cachedSync.QUERY_BOX.WRAPPER.ARBITRARY,
    )[0];

    if (!anchor) return null;

    return createAnchorData(target, anchor, {
      placement: "bottom-start",
      gutter: 5,
    });
  }

  if (isEditQueryBoxTextbox(target)) {
    return createAnchorData(target, target, {
      placement: "bottom",
      gutter: 10,
    });
  }

  return null;
}
