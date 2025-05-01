export const PPLX_SIDEBARV2_TABS = ["home", "spaces"] as const;

export type PplxSidebarV2Tab = (typeof PPLX_SIDEBARV2_TABS)[number];
