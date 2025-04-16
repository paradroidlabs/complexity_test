import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "queryBox:slashCommandMenu";

export default function SlashCommandMenuPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins["queryBox:slashCommandMenu"];

  const handleEnableChange = (checked: boolean) => {
    mutation.mutate((draft) => {
      draft.plugins["queryBox:slashCommandMenu"].enabled = checked;
    });
  };

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <P>
        This plugin allows you to use various slash commands to quickly access
        advanced features.
      </P>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => handleEnableChange(checked)}
      />

      {pluginSettings?.enabled && (
        <div className="x:flex x:flex-col x:gap-2">
          <Switch
            className="x:items-start"
            textLabel="Show trigger button on the query box"
            checked={pluginSettings?.showTriggerButton ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["queryBox:slashCommandMenu"].showTriggerButton =
                  checked;
              });
            }}
          />
        </div>
      )}

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/9B9us0C.png"
          alt="slash-command-menu"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
