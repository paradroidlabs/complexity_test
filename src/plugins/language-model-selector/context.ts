import { RefType } from "react-hotkeys-hook/dist/types";

import { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";

type LanguageModelSelectorContext = {
  component: "select" | "dropdown";
  isProSearchEnabled: boolean;
  hotkeyRef: (instance: RefType<HTMLElement>) => void;
  setIsProSearchEnabled: (isProSearchEnabled: boolean) => void;
  setHighlightedItem: (item: LanguageModelCode) => void;
};

export const LanguageModelSelectorContext =
  createContext<LanguageModelSelectorContext | null>(null);
