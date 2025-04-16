import SponsorDialogWrapper from "@/components/SponsorDialogWrapper";
import { Portal } from "@/components/ui/portal";
import { useHomeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";

export function SponsorHomeLink() {
  const bottomBar = useHomeDomObserverStore((store) => store.$bottomBar?.[0]);

  const portalContainer = useMemo(() => {
    if (!bottomBar) return null;

    const $existingContainer = $(bottomBar).find(
      `[data-cplx-component="sponsor-home-link-container"]`,
    );

    if ($existingContainer.length) return $existingContainer[0];

    const $container = $("<div>").internalComponentAttr(
      "sponsor-home-link-container",
    );

    $(bottomBar).prepend($container);

    return $container[0];
  }, [bottomBar]);

  return (
    <Portal container={portalContainer}>
      <SponsorDialogWrapper>
        <div className="x:cursor-pointer x:text-sm x:text-muted-foreground x:decoration-muted-foreground/50 x:hover:underline">
          Support Complexity
        </div>
      </SponsorDialogWrapper>
    </Portal>
  );
}
