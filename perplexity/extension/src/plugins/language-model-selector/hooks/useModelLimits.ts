import { useImmer } from "use-immer";

import type { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import usePplxUserSettings from "@/hooks/usePplxUserSettings";
import { languageModels } from "@/plugins/_core/misc/remote-language-models.loader";

export function useModelLimits() {
  const { data } = usePplxUserSettings();

  const getModelLimit = useCallback(
    (model: LanguageModel): number | null => {
      const limitKey = model.limitKey;
      if (!limitKey) return null;
      return (data as any)?.[limitKey];
    },
    [data],
  );

  const [modelsLimits, setModelsLimits] = useImmer<
    Partial<Record<LanguageModel["code"], number | null>>
  >({});

  useEffect(() => {
    setModelsLimits((draft) => {
      languageModels.forEach((model) => {
        draft[model.code] = getModelLimit(model);
      });
    });
  }, [data, getModelLimit, setModelsLimits]);

  return modelsLimits;
}
