import ExtensionUpdateInfoDialogWrapper from "@/components/ExtensionUpdateInfoDialogWrapper";
import { Portal } from "@/components/ui/portal";
import useExtensionUpdate from "@/hooks/useExtensionUpdate";
import { useHomeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";

export function HomepageUpdateAnnouncer() {
  const { isUpdateAvailable } = useExtensionUpdate();

  const $slogan = useHomeDomObserverStore((store) => store.$slogan);

  if (!$slogan || !$slogan.length || !isUpdateAvailable) return null;

  const $anchor = $slogan.find(">*").first();

  return (
    <Portal container={$anchor[0]}>
      <ExtensionUpdateInfoDialogWrapper>
        <div className="x:text-sm x:text-muted-foreground">
          A new version of the extension is available!
        </div>
      </ExtensionUpdateInfoDialogWrapper>
    </Portal>
  );
}
