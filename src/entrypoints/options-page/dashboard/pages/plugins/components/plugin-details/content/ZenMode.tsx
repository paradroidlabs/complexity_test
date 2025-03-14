import { useHotkeyRecorder } from "@/components/HotkeyRecorder";
import { Switch } from "@/components/ui/switch";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function ZenModePluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();
  const defaultKeys = settings?.plugins["zenMode"].hotkey ?? [];

  const { HotkeyRecorderUI } = useHotkeyRecorder({
    defaultKeys,
    onSave: (keys) => {
      mutation.mutate((draft) => {
        draft.plugins["zenMode"].hotkey = keys;
      });
    },
  });

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["zenMode"].enabled ?? false}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["zenMode"].enabled = checked;
          });
        }}
      />
      {settings?.plugins["zenMode"].enabled && (
        <>
          <div className="x:hidden x:flex-col x:gap-2 x:md:flex">
            <div>Activation hotkey:</div>
            <HotkeyRecorderUI />
          </div>
          <Switch
            textLabel="Persistent across reloads"
            checked={settings?.plugins["zenMode"].persistent ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["zenMode"].persistent = checked;
              });
            }}
          />
          <Switch
            textLabel="Always hide related questions"
            checked={
              settings?.plugins["zenMode"].alwaysHideRelatedQuestions ?? false
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["zenMode"].alwaysHideRelatedQuestions = checked;
              });
            }}
          />
          <Switch
            textLabel="Always hide visual columns"
            checked={settings?.plugins["zenMode"].alwaysHideVisualCols ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["zenMode"].alwaysHideVisualCols = checked;
              });
            }}
          />
        </>
      )}
    </div>
  );
}
