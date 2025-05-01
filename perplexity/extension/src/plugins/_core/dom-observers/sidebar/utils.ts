import { sidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import type { PplxSidebarV2Tab } from "@/plugins/_core/dom-observers/sidebar/types";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";

export function findSidebarWrapper() {
  const $wrapper = $(DomSelectorsService.cachedSync.SIDEBAR.WRAPPER);

  if (!$wrapper.length) return;

  updateSidebarTabContentState($wrapper);

  if (
    sidebarDomObserverStore.getState().$wrapper != null &&
    $wrapper.internalComponentAttr() ===
      DomSelectorsService.internalAttributes.SIDEBAR.WRAPPER
  )
    return;

  $wrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.SIDEBAR.WRAPPER,
  );

  sidebarDomObserverStore.setState({
    $wrapper,
  });
}

function updateSidebarTabContentState($wrapper: JQuery<HTMLElement>) {
  const isCollapsed = $wrapper
    .children()
    .first()
    .is(DomSelectorsService.cachedSync.SIDEBAR.TAB.CONTENT.WRAPPER_COLLAPSED);

  const currentState = $wrapper.attr("data-content-state");
  const newState = isCollapsed ? "collapsed" : "expanded";
  if (currentState !== newState) {
    $wrapper.attr("data-content-state", newState);
  }
}

export function findActiveSidebarContentTab() {
  const activeTab = (() => {
    const anchors = {
      home: DomSelectorsService.cachedSync.SIDEBAR.TAB.ANCHOR.HOME,
      spaces: DomSelectorsService.cachedSync.SIDEBAR.TAB.ANCHOR.SPACES,
    };

    for (const [tab, anchor] of Object.entries(anchors) as [
      PplxSidebarV2Tab,
      string,
    ][]) {
      if ($(anchor)[0]) {
        return tab;
      }
    }

    return null;
  })();

  sidebarDomObserverStore.setState({
    activePplxSidebarV2Tab: activeTab,
  });
}
