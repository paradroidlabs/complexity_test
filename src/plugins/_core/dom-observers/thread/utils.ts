import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { INTERNAL_ATTRIBUTES, DOM_SELECTORS } from "@/utils/dom-selectors";

export function findNavbar() {
  const $navbar = $(DOM_SELECTORS.THREAD.NAVBAR);

  if (
    !$navbar.length ||
    $navbar.internalComponentAttr() === INTERNAL_ATTRIBUTES.THREAD.NAVBAR
  )
    return;

  $navbar.internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.NAVBAR);

  const navbarHeight = $navbar[0].offsetHeight;

  $(document.body).css({
    "--navbar-height":
      navbarHeight != null && navbarHeight > 0
        ? `${navbarHeight - 1}px`
        : "53px",
  });

  threadDomObserverStore.setState({
    $navbar,
  });
}

export function findBookmarkButton() {
  const $navbar = threadDomObserverStore.getState().$navbar;

  if (!$navbar || !$navbar.length) return;

  const $overflowMenuButtonWrapper = $navbar.find(
    DOM_SELECTORS.SICKY_NAVBAR_CHILD.OVERFLOW_MENU_BUTTON_WRAPPER,
  );

  if (!$overflowMenuButtonWrapper.length) {
    threadDomObserverStore.setState({
      $bookmarkButton: null,
    });

    return;
  }

  if (
    $overflowMenuButtonWrapper.internalComponentAttr() ===
    INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.BOOKMARK_BUTTON
  )
    return;

  $overflowMenuButtonWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.BOOKMARK_BUTTON,
  );

  threadDomObserverStore.setState({
    $bookmarkButton: $overflowMenuButtonWrapper,
  });
}

export function findWrapper() {
  const $wrapper = $(DOM_SELECTORS.THREAD.WRAPPER);

  if (
    !$wrapper.length ||
    $wrapper.internalComponentAttr() === INTERNAL_ATTRIBUTES.THREAD.WRAPPER
  )
    return;

  $wrapper.internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.WRAPPER);

  threadDomObserverStore.setState({
    $wrapper,
  });
}

export function findPopper() {
  const $popper = $(DOM_SELECTORS.THREAD.POPPER.DESKTOP);

  if (
    !$popper.length ||
    $popper.internalComponentAttr() ===
      INTERNAL_ATTRIBUTES.THREAD.POPPER.DESKTOP
  )
    return;

  $popper.internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.POPPER.DESKTOP);

  threadDomObserverStore.setState({
    $popper,
  });
}
