import { threadDomObserverStore } from "@/plugins/_core/dom-observers/thread/store";
import { INTERNAL_ATTRIBUTES, DOM_SELECTORS } from "@/utils/dom-selectors";
import { setCssProperty } from "@/utils/utils";

export function findNavbar() {
  const $navbar = $(DOM_SELECTORS.THREAD.NAVBAR);

  if (
    !$navbar.length ||
    $navbar.internalComponentAttr() === INTERNAL_ATTRIBUTES.THREAD.NAVBAR
  )
    return;

  $navbar.internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.NAVBAR);

  if (!document.body.style.getPropertyValue("--navbar-height") && $navbar[0]) {
    const navbarHeight = $navbar[0].offsetHeight;

    if (navbarHeight > 0) {
      setCssProperty("--navbar-height", `${navbarHeight}px`);
    }
  }

  threadDomObserverStore.setState({
    $navbar,
  });
}

export function findNavbarOverflowMenuButtonWrapper() {
  const $navbar = threadDomObserverStore.getState().$navbar;

  if (!$navbar || !$navbar[0]) return;

  const $overflowMenuButtonWrapper = $navbar.find(
    DOM_SELECTORS.SICKY_NAVBAR_CHILD.OVERFLOW_MENU_BUTTON_WRAPPER,
  );

  if (!$overflowMenuButtonWrapper[0]) {
    threadDomObserverStore.setState({
      $overflowMenuButtonWrapper: null,
    });

    return;
  }

  if (
    $overflowMenuButtonWrapper.internalComponentAttr() ===
    INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.OVERFLOW_MENU_BUTTON_WRAPPER
  )
    return;

  $overflowMenuButtonWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.THREAD.NAVBAR_CHILD.OVERFLOW_MENU_BUTTON_WRAPPER,
  );

  threadDomObserverStore.setState({
    $overflowMenuButtonWrapper,
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

export function findPageWrapper() {
  const $pageWrapper = $(DOM_SELECTORS.THREAD.PAGE_WRAPPER);

  if (
    !$pageWrapper.length ||
    $pageWrapper.internalComponentAttr() ===
      INTERNAL_ATTRIBUTES.THREAD.PAGE_WRAPPER
  )
    return;

  $pageWrapper.internalComponentAttr(INTERNAL_ATTRIBUTES.THREAD.PAGE_WRAPPER);

  threadDomObserverStore.setState({
    $pageWrapper,
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

export function findMessageStickyHeaderHeight() {
  const $messageStickyHeader = $(
    DOM_SELECTORS.THREAD.MESSAGE.STICKY_HEADER,
  ).last();

  if (!$messageStickyHeader.length) return;

  if (
    document.body.style.getPropertyValue(
      "--message-block-sticky-header-height",
    ) ||
    !$messageStickyHeader[0]
  )
    return;

  const stickyHeaderHeight = $messageStickyHeader[0].offsetHeight;

  if (stickyHeaderHeight > 0) {
    setCssProperty(
      "--message-block-sticky-header-height",
      `${stickyHeaderHeight}px`,
    );
  }

  threadDomObserverStore.setState({
    messageStickyHeaderHeight: stickyHeaderHeight,
  });
}
