import { useQuery } from "@tanstack/react-query";

import { extensionPermissionsQueries } from "@/services/extension-permissions/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export function useExtensionPermissions() {
  const query = useQuery(extensionPermissionsQueries.permissions);

  const handleGrantPermission = ({
    permissions,
    hostPermissions,
  }: {
    permissions: chrome.runtime.ManifestPermissions[];
    hostPermissions?: string[];
  }) => {
    chrome.permissions
      .request({
        permissions,
        origins: hostPermissions,
      })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["permissions"] });
      })
      .catch((error) => {
        alert(`Error granting permissions: ${error}`);
      });
  };

  const handleRevokePermission = ({
    permissions,
    hostPermissions,
  }: {
    permissions: chrome.runtime.ManifestPermissions[];
    hostPermissions?: string[];
  }) => {
    chrome.permissions
      .remove({ permissions, origins: hostPermissions })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["permissions"] });
      })
      .catch((error) => {
        alert(`Error revoking permissions: ${error}`);
      });
  };

  return { query, handleGrantPermission, handleRevokePermission };
}
