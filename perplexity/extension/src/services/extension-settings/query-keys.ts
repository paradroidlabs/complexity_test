import { createQueryKeys } from "@lukemorales/query-key-factory";

import { ExtensionSettingsService } from "@/services/extension-settings";

export const extensionSettingsQueries = createQueryKeys("extensionSettings", {
  data: {
    queryKey: null,
    queryFn: () => ExtensionSettingsService.get(),
  },
});
