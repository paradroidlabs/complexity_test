import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useSidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import hideNativeHistoryCss from "@/plugins/space-navigator/sidebar-content/hide-native-history.css?inline";
import SidebarPinnedSpacesVisToggle from "@/plugins/space-navigator/sidebar-content/PinnedItemsVisToggle";
import SidebarPinnedSpaces from "@/plugins/space-navigator/sidebar-content/PinnedSpaces";
import SpaceNavigator from "@/plugins/space-navigator/sidebar-content/SpaceNavigator";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export function SpaceNavigatorWrapper() {
  useInsertCss({
    css: hideNativeHistoryCss,
    id: "space-navigator-hide-native-history",
  });

  const spaceButtonWrapper = useSidebarDomObserverStore(
    (state) => state.$spaceButtonWrapper?.[0],
    deepEqual,
  );

  const triggerButtonsPortalContainer = useSidebarDomObserverStore(
    (state) => state.$spaceButtonTriggerButtonsWrapper?.[0],
    deepEqual,
  );

  const $pinnedSpacesPortalContainer = useMemo(() => {
    if (spaceButtonWrapper == null) return null;

    const $spaceButtonWrapper = $(spaceButtonWrapper);

    const $existingPinnedSpacesPortalContainer = $spaceButtonWrapper
      .parent()
      .find(
        `[data-cplx-component="${INTERNAL_ATTRIBUTES.SIDEBAR.PINNED_SPACES_PORTAL_CONTAINER}"]`,
      );

    if ($existingPinnedSpacesPortalContainer.length) {
      return $existingPinnedSpacesPortalContainer;
    }

    const $portalContainer = $("<div>")
      .internalComponentAttr(
        INTERNAL_ATTRIBUTES.SIDEBAR.PINNED_SPACES_PORTAL_CONTAINER,
      )
      .appendTo($spaceButtonWrapper);

    return $portalContainer;
  }, [spaceButtonWrapper]);

  return (
    <>
      {triggerButtonsPortalContainer != null && (
        <Portal container={triggerButtonsPortalContainer}>
          <div className="x:-mr-2 x:flex x:w-full x:flex-1 x:items-center x:justify-end x:gap-1">
            <SidebarPinnedSpacesVisToggle />
            <SpaceNavigator />
          </div>
        </Portal>
      )}
      {$pinnedSpacesPortalContainer != null &&
        $pinnedSpacesPortalContainer.length > 0 && (
          <Portal container={$pinnedSpacesPortalContainer[0]}>
            <SidebarPinnedSpaces />
          </Portal>
        )}
    </>
  );
}
