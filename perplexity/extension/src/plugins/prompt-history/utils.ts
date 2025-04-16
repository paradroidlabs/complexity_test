import { getPromptHistoryService } from "@/services/indexed-db/prompt-history";
import { UiUtils } from "@/utils/ui-utils";

let lastUrl = window.location.pathname;

export const handlePromptSave = async (params?: {
  promptString?: string;
  url?: string;
  type?: "hard" | "soft";
}) => {
  if (params?.type === "soft" && lastUrl === params.url) {
    return;
  }

  lastUrl = params?.url ?? window.location.pathname;

  let prompt = params?.promptString;

  if (!params?.promptString) {
    const $activeQueryBox = UiUtils.getActiveQueryBoxTextarea();

    if (!$activeQueryBox[0]) return;

    prompt = $activeQueryBox[0].value;
  }

  if (prompt == null || prompt?.length === 0) return;

  await getPromptHistoryService().deduplicateAdd(prompt);
};
