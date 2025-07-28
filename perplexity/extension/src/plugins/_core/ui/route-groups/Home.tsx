import { HomepageUpdateAnnouncer } from "@/components/HomepageUpdateAnnouncer";
import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

export function HomepageComponents() {
  return (
    <CsUiPluginsGuard location={["home"]}>
      <HomepageUpdateAnnouncer />
    </CsUiPluginsGuard>
  );
}
