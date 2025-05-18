import { sidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import { isInternalNodeExists } from "@/plugins/_core/dom-observers/utils";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";

export function findSidebarWrapper() {
  const existingWrapper = sidebarDomObserverStore.getState().$wrapper?.[0];

  if (
    isInternalNodeExists({
      node: existingWrapper,
      selector: DomSelectorsService.cplxAttribute(
        DomSelectorsService.cachedSync.SIDEBAR.WRAPPER,
      ),
    })
  )
    return;

  const $wrapper = $(DomSelectorsService.cachedSync.SIDEBAR.WRAPPER);

  if (!$wrapper.length) return;

  $wrapper.internalComponentAttr(
    DomSelectorsService.internalAttributes.SIDEBAR.WRAPPER,
  );

  sidebarDomObserverStore.setState({
    $wrapper,
  });
}
