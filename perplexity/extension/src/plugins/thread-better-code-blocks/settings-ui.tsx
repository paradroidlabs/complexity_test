import { useQuery } from "@tanstack/react-query";
import { useLocation, useSearchParams } from "react-router-dom";

import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { PluginId } from "@/data/plugin-registry/types";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/plugins/thread-better-code-blocks/indexed-db/query-keys";
import CreateNewLanguageOptionButton from "@/plugins/thread-better-code-blocks/settings-ui/CreateNewLanguageOptionButton";
import BetterCodeBlockFineGrainedOptions from "@/plugins/thread-better-code-blocks/settings-ui/FineGrainedOptions";
import BetterCodeBlockGlobalOptions from "@/plugins/thread-better-code-blocks/settings-ui/GlobalOptions";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

export const pluginId: PluginId = "thread:betterCodeBlocks";

export default function BetterCodeBlocksPluginSettingsUi() {
  const { settings } = useExtensionSettings();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "global";

  const { data: fineGrainedOptions } = useQuery(
    betterCodeBlocksFineGrainedOptionsQueries.list.detail(),
  );

  const isFromPluginList = useLocation().state?.fromPluginList;

  return (
    <div className="x:flex x:flex-col x:gap-4">
      <Header />

      {settings?.plugins["thread:betterCodeBlocks"].enabled && (
        <Tabs
          value={activeTab}
          onValueChange={({ value }) => {
            setSearchParams(
              { tab: value },
              {
                state: {
                  fromPluginList: isFromPluginList,
                },
              },
            );
          }}
        >
          <TabsList className="x:mb-2 x:justify-start">
            <TabsTrigger value="global">Global</TabsTrigger>
            {fineGrainedOptions?.map((option) => (
              <TabsTrigger key={option.language} value={option.language}>
                {option.language}
              </TabsTrigger>
            ))}
            <CreateNewLanguageOptionButton />
          </TabsList>
          <TabsContent
            value="global"
            className="x:max-w-[500px] x:rounded-md x:bg-secondary x:p-4"
          >
            <BetterCodeBlockGlobalOptions />
          </TabsContent>
          {fineGrainedOptions?.map((option) => (
            <TabsContent
              key={option.language}
              value={option.language}
              className="x:rounded-md x:bg-secondary x:p-4"
            >
              <BetterCodeBlockFineGrainedOptions language={option.language} />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}

function Header() {
  const { settings, mutation } = useExtensionSettings();

  return (
    <>
      <div className="x:flex x:flex-col x:gap-2">
        Customize the appearance and usability of code blocks.
      </div>
      <Switch
        textLabel="Enable"
        checked={settings?.plugins["thread:betterCodeBlocks"].enabled}
        onCheckedChange={({ checked }) => {
          mutation.mutate((draft) => {
            draft.plugins["thread:betterCodeBlocks"].enabled = checked;
          });
        }}
      />
    </>
  );
}
