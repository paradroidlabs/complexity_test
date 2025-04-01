import { sendMessage } from "webext-bridge/content-script";

import Cplx from "@/components/icons/Cplx";
import FaArrowUpRight from "@/components/icons/FaArrowUpRight";
import { Portal } from "@/components/ui/portal";
import { useSettingsPageDomObserverStore } from "@/plugins/_core/dom-observers/settings-page/store";
import { DOM_SELECTORS, INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export default function SettingsDashboardLink() {
  const $sidebarWrapper = useSettingsPageDomObserverStore(
    (store) => store.$sidebarWrapper,
  );

  const portalContainer = useMemo(() => {
    if ($sidebarWrapper == null || !$sidebarWrapper.length) return null;

    const $existingContainer = $sidebarWrapper.find(
      `[data-cplx-component="${INTERNAL_ATTRIBUTES.SETTINGS_PAGE.CPLX_DASHBOARD_LINK}"]`,
    );

    if ($existingContainer[0]) return $existingContainer[0];

    const $portalContainer = $("<div>")
      .internalComponentAttr(
        INTERNAL_ATTRIBUTES.SETTINGS_PAGE.CPLX_DASHBOARD_LINK,
      )
      .insertAfter(
        $sidebarWrapper.find(
          DOM_SELECTORS.SETTINGS_PAGE.SIDEBAR_CHILD.BACK_BUTTON,
        ),
      );

    return $portalContainer[0];
  }, [$sidebarWrapper]);

  if (portalContainer == null) return null;

  return (
    <Portal container={portalContainer}>
      <div
        className="x:flex x:cursor-pointer x:items-center x:justify-start x:gap-1 x:rounded-lg x:mx-1 x:px-3 x:py-2 x:text-sm x:font-medium x:text-foreground x:transition-all x:hover:bg-primary-foreground"
        onClick={() => {
          sendMessage("bg:openOptionsPage", undefined, "background");
        }}
      >
        <div className="x:flex x:items-center x:gap-1.5">
          <Cplx className="x:size-4 x:fill-foreground" />
          <div>Complexity</div>
        </div>
        <FaArrowUpRight className="x:ml-auto x:size-3.5" />
      </div>
    </Portal>
  );
}
