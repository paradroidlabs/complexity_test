import { APP_CONFIG } from "@/app.config";
import type { LanguageModel } from "@/data/plugins/query-box/language-model-selector/language-models.types";
import type {
  CplxVersions,
  FeatureCompatibility,
} from "@/services/cplx-api/cplx-api.types";
import { CplxApiOfflineService } from "@/services/cplx-api/offline-service";
import { CplxApiService as CplxApiOnlineService } from "@/services/cplx-api/online-service";

export type ICplxApiService = {
  fetchVersions(): Promise<CplxVersions>;
  fetchFeatureCompat(): Promise<FeatureCompatibility>;
  fetchLanguageModels(): Promise<LanguageModel[]>;
  fetchChangelog(options?: { version?: string }): Promise<string>;
};

export const CplxApiService: ICplxApiService =
  APP_CONFIG.CPLX_CDN_URL != null
    ? CplxApiOnlineService
    : CplxApiOfflineService;
