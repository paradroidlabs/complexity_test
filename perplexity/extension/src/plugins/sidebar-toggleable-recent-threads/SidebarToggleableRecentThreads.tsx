import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useSidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";
import styles from "@/plugins/sidebar-toggleable-recent-threads/styles.css?inline";
import SidebarToggleableRecentThreadsToggleButton from "@/plugins/sidebar-toggleable-recent-threads/ToggleButton";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export function SidebarToggleableRecentThreads() {
  useInsertCss({
    css: styles,
    id: "sidebar-toggleable-recent-threads",
  });

  const libraryButtonWrapper = useSidebarDomObserverStore(
    (state) => state.$libraryButtonWrapper?.[0],
    deepEqual,
  );

  const $libraryButtonTriggerButtonsWrapper = useSidebarDomObserverStore(
    (state) => state.$libraryButtonTriggerButtonsWrapper,
    deepEqual,
  );

  const triggerButtonsPortalContainer = useMemo(() => {
    if (
      libraryButtonWrapper == null ||
      $libraryButtonTriggerButtonsWrapper == null ||
      !$libraryButtonTriggerButtonsWrapper.length
    )
      return null;

    const $existingPortalContainer = $(libraryButtonWrapper).find(
      `[data-cplx-component="${INTERNAL_ATTRIBUTES.SIDEBAR.LIBRARY_BUTTON_TRIGGER_BUTTONS_PORTAL_CONTAINER}-cplx"]`,
    );

    if ($existingPortalContainer.length) {
      return $existingPortalContainer[0];
    }

    const $portalContainer = $("<div>")
      .addClass("x:mr-1")
      .internalComponentAttr(
        `${
          INTERNAL_ATTRIBUTES.SIDEBAR
            .LIBRARY_BUTTON_TRIGGER_BUTTONS_PORTAL_CONTAINER
        }-cplx`,
      );

    $libraryButtonTriggerButtonsWrapper.prepend($portalContainer);

    return $portalContainer[0];
  }, [$libraryButtonTriggerButtonsWrapper, libraryButtonWrapper]);

  return (
    <Portal container={triggerButtonsPortalContainer}>
      <SidebarToggleableRecentThreadsToggleButton />
    </Portal>
  );
}
