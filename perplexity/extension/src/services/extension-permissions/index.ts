import { extensionPermissionsQueries } from "@/services/extension-permissions/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export class ExtensionPermissionsService {
  static setupReactiveListeners() {
    chrome.permissions.onAdded.addListener((permission) => {
      queryClient.invalidateQueries({
        queryKey: extensionPermissionsQueries.permissions.queryKey,
      });
    });

    chrome.permissions.onRemoved.addListener((permission) => {
      queryClient.invalidateQueries({
        queryKey: extensionPermissionsQueries.permissions.queryKey,
      });
    });
  }
}
