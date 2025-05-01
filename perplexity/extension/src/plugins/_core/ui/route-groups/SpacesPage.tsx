import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

export default function SpacesPageComponents() {
  return (
    <CsUiPluginsGuard requiresLoggedIn location={["collections_page"]}>
      {null}
    </CsUiPluginsGuard>
  );
}
