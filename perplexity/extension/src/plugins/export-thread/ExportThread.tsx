import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import ExportButton from "@/plugins/export-thread/ExportButton";
import hideOpenInAppBtnCss from "@/plugins/export-thread/hide-open-in-app-btn.css?inline";
import useCreatePortalContainer from "@/plugins/export-thread/useCreatePortalContainer";

export function ExportThread() {
  const portalContainer = useCreatePortalContainer();

  useInsertCss({
    id: "hide-open-in-app-btn",
    css: hideOpenInAppBtnCss,
  });

  return (
    <Portal container={portalContainer}>
      <ExportButton />
    </Portal>
  );
}
