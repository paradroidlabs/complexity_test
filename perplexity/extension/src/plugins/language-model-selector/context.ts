import type { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";

type LanguageModelSelectorContext = {
  component: "select" | "dropdown";
  setHighlightedItem: (item: LanguageModelCode) => void;
};

export const LanguageModelSelectorContext =
  createContext<LanguageModelSelectorContext | null>(null);
