import { isMobileStore } from "@/hooks/use-is-mobile-store";
import { sidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import { DOM_SELECTORS, INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export function findSidebarWrapper() {
  const $wrapper = $(DOM_SELECTORS.SIDEBAR.WRAPPER);

  if (!$wrapper.length) return;

  const isExpanded = $wrapper.hasClass("w-sideBarWidth");

  // Only update the attribute if it's different to avoid triggering mutation observer unnecessarily
  const currentState = $wrapper.attr("data-state");
  const newState = isExpanded ? "expanded" : "collapsed";
  if (currentState !== newState) {
    $wrapper.attr("data-state", newState);
  }

  if ($wrapper.internalComponentAttr() === INTERNAL_ATTRIBUTES.SIDEBAR.WRAPPER)
    return;

  $wrapper.internalComponentAttr(INTERNAL_ATTRIBUTES.SIDEBAR.WRAPPER);

  sidebarDomObserverStore.setState({
    $wrapper,
  });
}

export function findSpaceButtonWrapper() {
  const $wrapper = sidebarDomObserverStore.getState().$wrapper;

  if ($wrapper == null) return;

  const $spaceButtonWrapper = $wrapper.find(
    DOM_SELECTORS.SIDEBAR.SPACE_BUTTON_WRAPPER,
  );

  const isMobile = isMobileStore.getState().isMobile;
  const isExpanded = $wrapper.attr("data-state") === "expanded";

  if ((isMobile || !isExpanded) && $spaceButtonWrapper.length) {
    sidebarDomObserverStore.setState({
      $spaceButtonWrapper: null,
    });
    $spaceButtonWrapper.internalComponentAttr(null);
    return;
  }

  $spaceButtonWrapper
    .find(DOM_SELECTORS.SIDEBAR.SPACE_BUTTON)
    .addClass("x:group");

  if (
    !$spaceButtonWrapper.length ||
    $spaceButtonWrapper.internalComponentAttr() ===
      INTERNAL_ATTRIBUTES.SIDEBAR.SPACE_BUTTON_WRAPPER
  )
    return;

  $spaceButtonWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.SIDEBAR.SPACE_BUTTON_WRAPPER,
  );

  sidebarDomObserverStore.setState({
    $spaceButtonWrapper,
  });
}

export function findSpaceButtonTriggerButtonsWrapper() {
  const $spaceButtonWrapper =
    sidebarDomObserverStore.getState().$spaceButtonWrapper;

  if ($spaceButtonWrapper == null) return;

  const $spaceButtonTriggerButtonsWrapper = $spaceButtonWrapper.find(
    DOM_SELECTORS.SIDEBAR.SPACE_BUTTON_WRAPPER_CHILD
      .TRIGGER_BUTTONS_PORTAL_CONTAINER,
  );

  if (
    !$spaceButtonTriggerButtonsWrapper.length ||
    $spaceButtonTriggerButtonsWrapper.internalComponentAttr() ===
      INTERNAL_ATTRIBUTES.SIDEBAR.SPACE_BUTTON_TRIGGER_BUTTONS_PORTAL_CONTAINER
  )
    return;

  $spaceButtonTriggerButtonsWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.SIDEBAR.SPACE_BUTTON_TRIGGER_BUTTONS_PORTAL_CONTAINER,
  );

  sidebarDomObserverStore.setState({
    $spaceButtonTriggerButtonsWrapper,
  });
}

export function findLibraryButtonWrapper() {
  const $wrapper = sidebarDomObserverStore.getState().$wrapper;

  if ($wrapper == null) return;

  const $libraryButtonWrapper = $wrapper.find(
    DOM_SELECTORS.SIDEBAR.LIBRARY_BUTTON_WRAPPER,
  );

  const isMobile = isMobileStore.getState().isMobile;
  const isExpanded = $wrapper.attr("data-state") === "expanded";

  if ((isMobile || !isExpanded) && $libraryButtonWrapper.length) {
    sidebarDomObserverStore.setState({
      $libraryButtonWrapper: null,
    });
    $libraryButtonWrapper.internalComponentAttr(null);
    return;
  }

  $libraryButtonWrapper
    .find(DOM_SELECTORS.SIDEBAR.LIBRARY_BUTTON)
    .addClass("x:group");

  if (
    !$libraryButtonWrapper.length ||
    $libraryButtonWrapper.internalComponentAttr() ===
      INTERNAL_ATTRIBUTES.SIDEBAR.LIBRARY_BUTTON_WRAPPER
  )
    return;

  $libraryButtonWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.SIDEBAR.LIBRARY_BUTTON_WRAPPER,
  );

  sidebarDomObserverStore.setState({
    $libraryButtonWrapper,
  });
}

export function findLibraryButtonTriggerButtonsWrapper() {
  const $libraryButtonWrapper =
    sidebarDomObserverStore.getState().$libraryButtonWrapper;

  if ($libraryButtonWrapper == null) return;

  const $libraryButtonTriggerButtonsWrapper = $libraryButtonWrapper.find(
    DOM_SELECTORS.SIDEBAR.LIBRARY_BUTTON_WRAPPER_CHILD
      .TRIGGER_BUTTONS_PORTAL_CONTAINER,
  );

  if (
    !$libraryButtonTriggerButtonsWrapper.length ||
    $libraryButtonTriggerButtonsWrapper.internalComponentAttr() ===
      INTERNAL_ATTRIBUTES.SIDEBAR
        .LIBRARY_BUTTON_TRIGGER_BUTTONS_PORTAL_CONTAINER
  )
    return;

  $libraryButtonTriggerButtonsWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.SIDEBAR.LIBRARY_BUTTON_TRIGGER_BUTTONS_PORTAL_CONTAINER,
  );

  sidebarDomObserverStore.setState({
    $libraryButtonTriggerButtonsWrapper,
  });
}
