import { registerBetterCodeBlocksFineGrainedOptionsService } from "@/services/indexed-db/better-code-blocks";
import { registerPinnedSpacesService } from "@/services/indexed-db/pinned-spaces";
import { registerPromptHistoryService } from "@/services/indexed-db/prompt-history";
import { registerLocalThemesService } from "@/services/indexed-db/themes";

export function registerProxyServices() {
  registerLocalThemesService();
  registerBetterCodeBlocksFineGrainedOptionsService();
  registerPromptHistoryService();
  registerPinnedSpacesService();
}
