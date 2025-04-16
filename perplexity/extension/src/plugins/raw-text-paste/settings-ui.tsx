import KeyCombo from "@/components/KeyCombo";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "queryBox:rawTextPaste";

export default function NoFileCreationOnPastePluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["queryBox:rawTextPaste"].enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:rawTextPaste"].enabled = checked;
          });
        }}
      />
      {settings.plugins["queryBox:rawTextPaste"].enabled && (
        <div className="">
          <Switch
            textLabel="Always active"
            checked={
              settings?.plugins["queryBox:rawTextPaste"].alwaysActive ?? false
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["queryBox:rawTextPaste"].alwaysActive = checked;
              });
            }}
          />
          {!settings.plugins["queryBox:rawTextPaste"].alwaysActive && (
            <P>
              Activation hotkey: <KeyCombo keys={["Ctrl", "Shift", "V"]} />.
            </P>
          )}
        </div>
      )}
    </div>
  );
}
