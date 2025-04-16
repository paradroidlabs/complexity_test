import { lazily } from "react-lazily";

import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";

const { SettingsDashboardLink } = lazily(
  () => import("@/components/SettingsDashboardLink"),
);

export default function SettingsComponents() {
  return (
    <CsUiPluginsGuard location={["settings"]}>
      <SettingsDashboardLink />
    </CsUiPluginsGuard>
  );
}
