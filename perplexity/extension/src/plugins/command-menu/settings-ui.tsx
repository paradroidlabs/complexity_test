import { useHotkeyRecorder } from "@/components/hotkey-recorder";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "commandMenu";

export default function CommandMenuPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const defaultKeys = settings?.plugins["commandMenu"].hotkey ?? [];

  const { HotkeyRecorderUi } = useHotkeyRecorder({
    defaultKeys,
    onSave: (keys) => {
      mutation.mutate((draft) => {
        draft.plugins["commandMenu"].hotkey = keys;
      });
    },
  });

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <div>
        Similar to Mac&apos;s Spotlight / Windows&apos;s PowerToys Run, but
        inside Perplexity.
      </div>
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["commandMenu"].enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["commandMenu"].enabled = checked;
          });
        }}
      />
      {settings?.plugins["commandMenu"].enabled && (
        <>
          <div className="x:hidden x:flex-col x:gap-2 x:md:flex">
            <div>Activation hotkey:</div>
            <HotkeyRecorderUi />
          </div>
          <div className="x:text-sm x:text-muted-foreground">
            Side note: Thread search is subject to rate limiting by Perplexity
            at any time.
          </div>
        </>
      )}
      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/m8x0hm1.png"
          alt="command-menu"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
