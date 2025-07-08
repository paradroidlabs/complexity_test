import ExportDataButtons from "@/entrypoints/options-page/dashboard/pages/settings/components/ExportDataButtons";
import ImportDataButtons from "@/entrypoints/options-page/dashboard/pages/settings/components/ImportDataButtons";
import SettingsItem from "@/entrypoints/options-page/dashboard/pages/settings/SettingsItem";
import SettingsSection from "@/entrypoints/options-page/dashboard/pages/settings/SettingsSection";

export default function DataSection() {
  return (
    <SettingsSection title="Data">
      <SettingsItem title="Import" description="Load saved extension's data">
        <ImportDataButtons />
      </SettingsItem>
      <SettingsItem
        title="Export"
        description="Download extension's data as a file"
      >
        <ExportDataButtons />
      </SettingsItem>
    </SettingsSection>
  );
}
