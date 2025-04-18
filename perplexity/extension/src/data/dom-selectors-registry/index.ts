import {
  DOM_SELECTORS,
  INTERNAL_ATTRIBUTES,
  TEST_ID,
} from "@/data/dom-selectors-registry/dom-selectors";
import type { DomSelectors } from "@/data/dom-selectors-registry/types";

export class DomSelectorsRegistry {
  static local: DomSelectors = DOM_SELECTORS;
  static remote: DomSelectors | null = null;
  static internalAttributes = INTERNAL_ATTRIBUTES;
  static testIds = TEST_ID;

  static get cachedSync() {
    return DomSelectorsRegistry.remote ?? DomSelectorsRegistry.local;
  }
}
