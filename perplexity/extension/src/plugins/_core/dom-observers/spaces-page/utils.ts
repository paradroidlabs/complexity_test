import { spacesPageDomObserverStore } from "@/plugins/_core/dom-observers/spaces-page/store";
import { DOM_SELECTORS, INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export function observeSpaceCard() {
  const $spaceCard = $(DOM_SELECTORS.SPACES_PAGE.SPACE_CARD);

  if (!$spaceCard.length) return;

  const spaceCards = $spaceCard.toArray();

  spaceCards.forEach((spaceCard) => {
    const $spaceCard = $(spaceCard);

    if (
      $spaceCard.internalComponentAttr() ===
      INTERNAL_ATTRIBUTES.SPACES_PAGE.SPACE_CARD
    )
      return;

    $spaceCard.internalComponentAttr(
      INTERNAL_ATTRIBUTES.SPACES_PAGE.SPACE_CARD,
    );
  });

  spacesPageDomObserverStore.setState({
    spaceCards: spaceCards.map((spaceCard) => $(spaceCard)),
  });
}
