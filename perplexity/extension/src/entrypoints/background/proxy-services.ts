import { registerBetterCodeBlocksFineGrainedOptionsService } from "@/services/indexed-db/better-code-blocks";
import { registerPromptHistoryService } from "@/services/indexed-db/prompt-history";
import { registerQueryCacheService } from "@/services/indexed-db/query-cache";
import { registerLocalThemesService } from "@/services/indexed-db/themes";

export function registerProxyServices() {
  registerQueryCacheService();
  registerLocalThemesService();
  registerBetterCodeBlocksFineGrainedOptionsService();
  registerPromptHistoryService();
}
