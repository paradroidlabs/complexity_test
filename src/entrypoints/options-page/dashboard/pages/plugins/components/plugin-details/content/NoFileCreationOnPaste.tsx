import KeyCombo from "@/components/KeyCombo";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function NoFileCreationOnPastePluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  if (!settings) return null;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Switch
        textLabel="Enable"
        checked={
          settings?.plugins["queryBox:noFileCreationOnPaste"].enabled ?? false
        }
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["queryBox:noFileCreationOnPaste"].enabled = checked;
          });
        }}
      />
      {settings.plugins["queryBox:noFileCreationOnPaste"].enabled && (
        <div className="">
          <Switch
            textLabel="Always active"
            checked={
              settings?.plugins["queryBox:noFileCreationOnPaste"]
                .alwaysActive ?? false
            }
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins["queryBox:noFileCreationOnPaste"].alwaysActive =
                  checked;
              });
            }}
          />
          {!settings.plugins["queryBox:noFileCreationOnPaste"].alwaysActive && (
            <P>
              Activation hotkey: <KeyCombo keys={["Ctrl", "Shift", "V"]} />.
            </P>
          )}
        </div>
      )}
    </div>
  );
}
