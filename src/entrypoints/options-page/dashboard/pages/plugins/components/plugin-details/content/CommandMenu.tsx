import { useHotkeyRecorder } from "@/components/HotkeyRecorder";
import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function CommandMenuPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const defaultKeys = settings?.plugins["commandMenu"].hotkey ?? [];

  const { HotkeyRecorderUI } = useHotkeyRecorder({
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
            <HotkeyRecorderUI />
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
