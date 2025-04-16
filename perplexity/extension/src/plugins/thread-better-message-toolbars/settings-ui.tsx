import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:betterMessageToolbars";

export default function BetterThreadMessageToolbarsPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings = settings?.plugins["thread:betterMessageToolbars"];

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:betterMessageToolbars"].enabled = checked;
          });
        }}
      />

      <Switch
        textLabel="Sticky toolbars"
        checked={pluginSettings?.sticky ?? true}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:betterMessageToolbars"].sticky = checked;
          });
        }}
      />

      <Switch
        textLabel="Hide unnecessary buttons"
        checked={pluginSettings?.hideUnnecessaryButtons ?? true}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins[
              "thread:betterMessageToolbars"
            ].hideUnnecessaryButtons = checked;
          });
        }}
      />

      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/WRD4ISa.png"
          alt="better-thread-message-toolbars"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
