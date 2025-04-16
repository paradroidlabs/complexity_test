import { useHotkeys } from "react-hotkeys-hook";

import type { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import {
  fastLanguageModels,
  reasoningLanguageModels,
} from "@/plugins/_core/misc/remote-language-models.loader";

export type ColumnType = "fast" | "reasoning";

export function useColumnNavigation({
  highlightedItem,
  setHighlightedItem,
  enabled,
}: {
  highlightedItem: LanguageModelCode;
  setHighlightedItem: (item: LanguageModelCode) => void;
  enabled: boolean;
}) {
  const [currentColumn, setCurrentColumn] = useState<ColumnType>(() =>
    fastLanguageModels.some((model) => model.code === highlightedItem)
      ? "fast"
      : "reasoning",
  );

  const [columnIndices, setColumnIndices] = useState({
    fast: 0,
    reasoning: 0,
  });

  useEffect(() => {
    const fastIndex = fastLanguageModels.findIndex(
      (model) => model.code === highlightedItem,
    );
    const reasoningIndex = reasoningLanguageModels.findIndex(
      (model) => model.code === highlightedItem,
    );

    if (fastIndex !== -1) {
      setColumnIndices((prev) => ({ ...prev, fast: fastIndex }));
      setCurrentColumn("fast");
    } else if (reasoningIndex !== -1) {
      setColumnIndices((prev) => ({ ...prev, reasoning: reasoningIndex }));
      setCurrentColumn("reasoning");
    }
  }, [highlightedItem]);

  const handleColumnNavigation = useCallback(() => {
    const newColumn = currentColumn === "fast" ? "reasoning" : "fast";
    const models =
      newColumn === "fast" ? fastLanguageModels : reasoningLanguageModels;
    const currentIndex = columnIndices[newColumn];

    const safeIndex = Math.min(currentIndex, models.length - 1);

    setCurrentColumn(newColumn);
    setHighlightedItem(models[safeIndex]!.code);
  }, [currentColumn, columnIndices, setHighlightedItem]);

  const ref = useHotkeys(
    [Key.ArrowLeft, Key.ArrowRight],
    handleColumnNavigation,
    {
      enabled,
      enableOnFormTags: true,
    },
  );

  return ref;
}
