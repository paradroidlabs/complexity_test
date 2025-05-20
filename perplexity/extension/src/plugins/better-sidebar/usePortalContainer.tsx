import { useSidebarDomObserverStore } from "@/plugins/_core/dom-observers/sidebar/store";

export default function usePortalContainer() {
  const $navtiveSidebarWrapper = useSidebarDomObserverStore(
    (store) => store.$wrapper,
    deepEqual,
  );

  return useMemo(() => {
    if (!$navtiveSidebarWrapper) return null;

    const $existingContainer = $("#better-sidebar-container");

    if ($existingContainer.length) {
      return $existingContainer[0];
    }

    const $container = $("<div>");

    $container.attr("id", "better-sidebar-container");

    $navtiveSidebarWrapper.before($container);

    return $container[0];
  }, [$navtiveSidebarWrapper]);
}
