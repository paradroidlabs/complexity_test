import { APP_CONFIG } from "@/app.config";
import { PluginRegistry } from "@/data/plugin-registry";
import { localLanguageModels } from "@/data/plugins/query-box/language-model-selector/language-models";
import type { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import type {
  CplxVersions,
  FeatureCompatibility,
} from "@/services/cplx-api/cplx-api.types";

export class CplxApiOfflineService {
  static async fetchVersions(): Promise<CplxVersions> {
    return {
      changelogEntries: [],
      latest: APP_CONFIG.VERSION,
      canvasInstructionLastUpdated: Date.now(),
    };
  }

  static async fetchFeatureCompat(): Promise<FeatureCompatibility> {
    return Object.fromEntries(
      Object.keys(PluginRegistry.manifests).map((key) => [
        key,
        APP_CONFIG.VERSION,
      ]),
    );
  }

  static async fetchLanguageModels(): Promise<LanguageModel[]> {
    return localLanguageModels as unknown as LanguageModel[];
  }

  static async fetchChangelog({ version }: { version?: string } = {}) {
    return "";
  }
}
