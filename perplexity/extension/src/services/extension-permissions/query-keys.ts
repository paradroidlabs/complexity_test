import { createQueryKeys } from "@lukemorales/query-key-factory";

export const extensionPermissionsQueries = createQueryKeys(
  "extensionPermissions",
  {
    permissions: {
      queryKey: null,
      queryFn: () => chrome.permissions.getAll(),
    },
  },
);
