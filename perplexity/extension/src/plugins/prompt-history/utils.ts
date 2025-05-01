import { getActiveQueryBoxTextarea } from "@/plugins/_core/ui/groups/query-box/utils";
import { getPromptHistoryService } from "@/plugins/prompt-history/indexed-db";

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
    const $activeQueryBox = getActiveQueryBoxTextarea();

    if (!$activeQueryBox[0]) return;

    prompt = $activeQueryBox[0].value;
  }

  if (prompt == null || prompt?.length === 0) return;

  await getPromptHistoryService().deduplicateAdd(prompt);
};
