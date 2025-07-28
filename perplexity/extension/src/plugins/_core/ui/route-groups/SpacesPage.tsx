import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

export function SpacesPageComponents() {
  return (
    <CsUiPluginsGuard requiresLoggedIn location={["collections_page"]}>
      {null}
    </CsUiPluginsGuard>
  );
}
