import ClearAllDataButton from "@/entrypoints/options-page/dashboard/pages/settings/components/ClearAllDataButton";
import ClearRemoteResourcesCache from "@/entrypoints/options-page/dashboard/pages/settings/components/ClearRemoteResourcesCache";
import SettingsItem from "@/entrypoints/options-page/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/options-page/dashboard/pages/settings/SettingsSection";

export default function TroubleshootingSection() {
  return (
    <SettingsSection title="Troubleshooting">
      <SettingsItem title="Clear cache">
        <ClearRemoteResourcesCache />
      </SettingsItem>
      <SettingsItem title="Reset the extension">
        <ClearAllDataButton />
      </SettingsItem>
    </SettingsSection>
  );
}
