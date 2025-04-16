import { Portal } from "@/components/ui/portal";
import { useInsertCss } from "@/hooks/useInsertCss";
import { useSpacesPageDomObserverStore } from "@/plugins/_core/dom-observers/spaces-page/store";
import relativePositionedCard from "@/plugins/space-navigator/spaces-page/space-cards.css?inline";
import SpaceCardPinButton from "@/plugins/space-navigator/spaces-page/SpaceCardPinButton";

export default function SpaceCardsWrapper() {
  const spaceCards = useSpacesPageDomObserverStore((state) => state.spaceCards);

  useInsertCss({
    css: relativePositionedCard,
    id: "space-cards",
  });

  if (spaceCards == null) return null;

  return spaceCards.map(($spaceCard, index) => {
    if (!$spaceCard[0]) return null;

    return (
      <Portal key={index} container={$spaceCard[0]}>
        <SpaceCardPinButton htmlNode={$spaceCard[0]} />
      </Portal>
    );
  });
}
