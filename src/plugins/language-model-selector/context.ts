import { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";

type LanguageModelSelectorContext = {
  component: "select" | "dropdown";
  isProSearchEnabled: boolean;
  setIsProSearchEnabled: (isProSearchEnabled: boolean) => void;
  setHighlightedItem: (item: LanguageModelCode) => void;
};

export const LanguageModelSelectorContext =
  createContext<LanguageModelSelectorContext | null>(null);
