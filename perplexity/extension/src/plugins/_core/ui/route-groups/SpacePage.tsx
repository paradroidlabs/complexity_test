import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

const { SpaceCardsWrapper } = lazily(
  () => import("@/plugins/space-navigator/spaces-page"),
);

export default function SpacePageComponents() {
  return (
    <CsUiPluginsGuard
      desktopOnly
      requiresLoggedIn
      location={["collections_page"]}
    >
      <SpaceCardsWrapper />
    </CsUiPluginsGuard>
  );
}
