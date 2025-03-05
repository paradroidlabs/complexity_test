import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { Plugins } from "@/services/extension-local-storage/plugins.types";
import useExtensionLocalStorage from "@/services/extension-local-storage/useExtensionLocalStorage";

export default function BetterThreadMessageToolbarsPluginDetails() {
  const { settings, mutation } = useExtensionLocalStorage();

  const handleCheckedChange = useCallback(
    (key: keyof Plugins["thread:betterMessageToolbars"]) =>
      ({ checked }: { checked: boolean }) =>
        mutation.mutate((draft) => {
          draft.plugins["thread:betterMessageToolbars"][key] = checked;
        }),
    [mutation],
  );

  return (
    <div className="x-flex x-flex-col x-gap-4 x-overflow-y-auto">
      <div className="x-flex x-flex-col x-gap-2">
        Useful tweaks to make the toolbar more compact and easier to use.
      </div>
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["thread:betterMessageToolbars"].enabled}
        onCheckedChange={handleCheckedChange("enabled")}
      />
      {settings?.plugins["thread:betterMessageToolbars"].enabled && (
        <div className="x-flex x-flex-col x-gap-2">
          <div className="x-text-sm x-text-muted-foreground">Options</div>
          <Switch
            className="x-items-start"
            textLabel={
              <div>
                <div>Stick to top</div>
                <div className="x-text-sm x-text-muted-foreground">
                  Always keep the toolbar visible at the top of the page when
                  scrolling
                </div>
              </div>
            }
            checked={settings?.plugins["thread:betterMessageToolbars"].sticky}
            onCheckedChange={handleCheckedChange("sticky")}
          />
          <Switch
            className="x-items-start"
            textLabel={
              <div>
                <div>Edit Query Button</div>
                <div className="x-text-sm x-text-muted-foreground">
                  Add a button to edit the query
                </div>
              </div>
            }
            checked={
              settings?.plugins["thread:betterMessageToolbars"].editQueryButton
            }
            onCheckedChange={handleCheckedChange("editQueryButton")}
          />
          <Switch
            className="x-items-start"
            textLabel={
              <div>
                <div>Explicit Model Name</div>
                <div className="x-text-sm x-text-muted-foreground">
                  Show the model name without hovering
                </div>
              </div>
            }
            checked={
              settings?.plugins["thread:betterMessageToolbars"]
                .explicitModelName
            }
            onCheckedChange={handleCheckedChange("explicitModelName")}
          />
          <Switch
            className="x-items-start"
            textLabel={
              <div>
                <div>Hide Unnecessary Buttons</div>
                <div className="x-text-sm x-text-muted-foreground">
                  Hide Thumbs Up/Down buttons
                </div>
              </div>
            }
            checked={
              settings?.plugins["thread:betterMessageToolbars"]
                .hideUnnecessaryButtons
            }
            onCheckedChange={handleCheckedChange("hideUnnecessaryButtons")}
          />
          <Switch
            className="x-items-start"
            textLabel={
              <div>
                <div>Word and Character Count</div>
                <div className="x-text-sm x-text-muted-foreground">
                  Show words and characters count
                </div>
              </div>
            }
            checked={
              settings?.plugins["thread:betterMessageToolbars"]
                .wordsAndCharactersCount
            }
            onCheckedChange={handleCheckedChange("wordsAndCharactersCount")}
          />
          {settings.plugins["thread:betterMessageToolbars"]
            .wordsAndCharactersCount && (
            <Switch
              className="x-items-start"
              textLabel={
                <div>
                  <div>Estimated Token Count</div>
                  <div className="x-text-sm x-text-muted-foreground">
                    Tokens are calculated by dividing visible characters by 4
                    and do NOT include web sources/attachments
                  </div>
                </div>
              }
              checked={
                settings?.plugins["thread:betterMessageToolbars"].tokensCount
              }
              onCheckedChange={handleCheckedChange("tokensCount")}
            />
          )}
        </div>
      )}
      <div className="x-mx-auto x-w-full x-max-w-[700px]">
        <Image
          src="https://i.imgur.com/xxqkuDn.png"
          alt="better-thread-message-toolbars"
          className="x-w-full"
        />
      </div>
    </div>
  );
}
