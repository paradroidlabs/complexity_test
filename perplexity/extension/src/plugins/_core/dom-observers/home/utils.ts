import { homeDomObserverStore } from "@/plugins/_core/dom-observers/home/store";
import { DOM_SELECTORS, INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export function findSlogan() {
  const $slogan = $(DOM_SELECTORS.HOME.SLOGAN);

  if (
    !$slogan.length ||
    $slogan.internalComponentAttr() === INTERNAL_ATTRIBUTES.HOME.SLOGAN
  )
    return;

  $slogan.internalComponentAttr(INTERNAL_ATTRIBUTES.HOME.SLOGAN);

  homeDomObserverStore.setState({
    $slogan,
  });
}

export function findBottomBar() {
  const $bottomBar = $(DOM_SELECTORS.HOME.BOTTOM_BAR);

  if (
    !$bottomBar.length ||
    $bottomBar.internalComponentAttr() === INTERNAL_ATTRIBUTES.HOME.BOTTOM_BAR
  )
    return;

  $bottomBar.internalComponentAttr(INTERNAL_ATTRIBUTES.HOME.BOTTOM_BAR);

  homeDomObserverStore.setState({
    $bottomBar,
  });
}

let previousLanguage = "";

export function observeLanguageSelector() {
  const ariaLabel =
    $(DOM_SELECTORS.HOME.LANGUAGE_SELECTOR).attr("aria-label") ?? "";

  if (!previousLanguage || ariaLabel === previousLanguage) {
    previousLanguage = ariaLabel;
    return;
  }

  window.location.reload();
}
