import { Image } from "@/components/ui/image";
import { Switch } from "@/components/ui/switch";
import { P } from "@/components/ui/typography";
import type { PluginId } from "@/data/plugin-registry/types";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "queryBox:slashCommandMenu:promptHistory";

export default function PromptHistoryPluginSettingsUi() {
  const { settings, mutation } = useExtensionSettings();
  const pluginSettings =
    settings?.plugins["queryBox:slashCommandMenu:promptHistory"];

  const handleEnableChange = (checked: boolean) => {
    mutation.mutate((draft) => {
      draft.plugins["queryBox:slashCommandMenu:promptHistory"].enabled =
        checked;
    });
  };

  if (!settings) return null;

  return (
    <div className="x:flex x:max-w-lg x:flex-col x:gap-4">
      <P>
        Frustrated when losing your prompt? This plugin will locally save your
        prompt to history and allow you to easily access it.
      </P>
      <Switch
        textLabel="Enable"
        checked={pluginSettings?.enabled ?? false}
        onCheckedChange={({ checked }) => handleEnableChange(checked)}
      />

      {pluginSettings?.enabled && (
        <div className="x:ml-8 x:flex x:flex-col x:gap-2">
          <Switch
            className="x:items-start"
            textLabel={
              <div>
                <div>Save on submit</div>
                <div className="x:text-sm x:text-muted-foreground">
                  When you submit a new prompt
                </div>
              </div>
            }
            checked={pluginSettings?.trigger.onSubmit ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins[
                  "queryBox:slashCommandMenu:promptHistory"
                ].trigger.onSubmit = checked;
              });
            }}
          />
          <Switch
            className="x:items-start"
            textLabel={
              <div>
                <div>Save on navigation</div>
                <div className="x:text-sm x:text-muted-foreground">
                  When you (accidentally) navigate away from the page (or when
                  Perplexity forces the page to reload)
                </div>
              </div>
            }
            checked={pluginSettings?.trigger.onNavigation ?? false}
            onCheckedChange={({ checked }) => {
              mutation.mutate((draft) => {
                draft.plugins[
                  "queryBox:slashCommandMenu:promptHistory"
                ].trigger.onNavigation = checked;
              });
            }}
          />
        </div>
      )}
      <div className="x:mx-auto x:w-full x:max-w-[700px]">
        <Image
          src="https://i.imgur.com/3miAzlF.png"
          alt="prompt-history"
          className="x:w-full"
        />
      </div>
    </div>
  );
}
