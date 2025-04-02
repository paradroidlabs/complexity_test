import { LanguageModelCode } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import { PplxWebResult } from "@/utils/thread-export";

export type MessageBlock = {
  nodes: {
    $wrapper: JQuery<HTMLElement>;
    $query: JQuery<HTMLElement>;
    $queryHoverContainer: JQuery<HTMLElement>;
    $sources: JQuery<HTMLElement>;
    $answer: JQuery<HTMLElement>;
    $bottomBar: JQuery<HTMLElement>;
  };
  content: {
    backendUuid: string;
    title: string;
    answer: string;
    webResults: PplxWebResult[];
    displayModel: LanguageModelCode;
    authorUuid: string | null;
  };
  states: {
    isInFlight: boolean;
    isEditingQuery: boolean;
    isVirtualized: boolean;
  };
};
