import { isLanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { sharedQueryBoxStore } from "@/plugins/_core/ui/groups/query-box/shared-store";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";

export function createToolbarPortalContainers({
  queryBox,
}: {
  queryBox: HTMLElement;
}): {
  leftToolbar: {
    leftContainer: HTMLElement | null;
    rightContainer: HTMLElement | null;
  };
  rightToolbar: {
    leftContainer: HTMLElement | null;
    rightContainer: HTMLElement | null;
  };
} {
  const $textareaWrapper = $(queryBox).find("textarea").parent();
  const $queryBoxComponentsWrapper = $textareaWrapper.parent();

  $queryBoxComponentsWrapper.internalComponentAttr(
    INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.COMPONENTS_WRAPPER,
  );

  // --- Left Toolbar ---
  const $pplxLeftToolbarWrapper =
    $queryBoxComponentsWrapper.find(">div:nth-child(2)"); // Might be brittle

  if ($pplxLeftToolbarWrapper.length) {
    $pplxLeftToolbarWrapper
      .find(">div.flex:first-child")
      .internalComponentAttr(
        INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD
          .PPLX_LEFT_TOOLBAR_COMPONENTS_WRAPPER,
      );
  }

  const $leftToolbarLeftContainer = findOrCreateContainer(
    $pplxLeftToolbarWrapper,
    INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD
      .CPLX_LEFT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
    "prepend",
  );

  const $leftToolbarRightContainer = findOrCreateContainer(
    $pplxLeftToolbarWrapper,
    INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD
      .CPLX_LEFT_TOOLBAR_COMPONENTS_RIGHT_WRAPPER,
    "append",
  );

  // --- Right Toolbar ---
  let $rightToolbarLeftContainer: JQuery<HTMLElement> | null = null;
  const $pplxRightToolbarWrapper =
    $queryBoxComponentsWrapper.find(">div:nth-child(3)");

  if ($pplxRightToolbarWrapper.length) {
    $pplxRightToolbarWrapper.internalComponentAttr(
      INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD.PPLX_RIGHT_TOOLBAR_COMPONENTS_WRAPPER,
    );

    $pplxRightToolbarWrapper
      .find(">div.flex:first-child")
      .internalComponentAttr(
        INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD
          .PPLX_RIGHT_TOOLBAR_COMPONENTS_WRAPPER,
      );

    $rightToolbarLeftContainer = findOrCreateContainer(
      $pplxRightToolbarWrapper,
      INTERNAL_ATTRIBUTES.QUERY_BOX_CHILD
        .CPLX_RIGHT_TOOLBAR_COMPONENTS_LEFT_WRAPPER,
      "prepend",
    );
  }

  return {
    leftToolbar: {
      leftContainer: $leftToolbarLeftContainer?.[0] ?? null,
      rightContainer: $leftToolbarRightContainer?.[0] ?? null,
    },
    rightToolbar: {
      leftContainer: $rightToolbarLeftContainer?.[0] ?? null,
      rightContainer: null,
    },
  };
}

function findOrCreateContainer(
  $parentElement: JQuery<HTMLElement>,
  internalAttribute: string,
  position: "prepend" | "append",
): JQuery<HTMLElement> | null {
  if (!$parentElement?.length) {
    return null;
  }

  const selector = `[data-cplx-component="${internalAttribute}"]`;
  const $existingContainer = $parentElement.find(selector);

  if ($existingContainer.length) {
    return $existingContainer;
  }

  const $newContainer = $("<div>")
    .addClass("x:[&:empty]:hidden")
    .internalComponentAttr(internalAttribute);

  if (position === "prepend") {
    $parentElement.prepend($newContainer);
  } else {
    $parentElement.append($newContainer);
  }

  return $newContainer;
}

export function populateDefaults() {
  const selectedLanguageModel = localStorage.getItem("cplx.selected-model");

  if (!selectedLanguageModel || !isLanguageModelCode(selectedLanguageModel)) {
    return;
  }

  sharedQueryBoxStore
    .getState()
    .setSelectedLanguageModel(selectedLanguageModel);
}
