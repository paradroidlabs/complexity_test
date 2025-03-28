import { settingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { DOM_SELECTORS, INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export function findSidebar() {
  const $sidebar = $(DOM_SELECTORS.SETTINGS_PAGE.SIDEBAR_WRAPPER);

  if (!$sidebar.length) return;

  if (
    $sidebar.internalComponentAttr() ===
    INTERNAL_ATTRIBUTES.SETTINGS_PAGE.SIDEBAR_WRAPPER
  )
    return;

  $sidebar.internalComponentAttr(
    INTERNAL_ATTRIBUTES.SETTINGS_PAGE.SIDEBAR_WRAPPER,
  );

  settingsPageDomObserverStore.setState({
    $sidebarWrapper: $sidebar,
  });
}
