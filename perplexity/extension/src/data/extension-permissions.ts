export const OPTIONAL_PERMISSIONS =
  [] as const satisfies chrome.runtime.ManifestPermissions[];

export const OPTIONAL_PERMISSIONS_DETAILS: Partial<
  Record<
    (typeof OPTIONAL_PERMISSIONS)[number],
    {
      title: string;
      description: string;
    }
  >
> = {};
