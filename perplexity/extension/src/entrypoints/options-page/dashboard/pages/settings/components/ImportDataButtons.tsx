import { storage } from "@wxt-dev/storage";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import type { ExtensionData } from "@/data/dashboard/extension-data.types";
import ImportDataPasteDialogWrapper from "@/entrypoints/options-page/dashboard/pages/settings/components/ImportDataPasteDialogWrapper";
import { transfromFlatSchema } from "@/services/extension-settings/migrations";
import type { ExtensionSettings } from "@/services/extension-settings/types";
import { db } from "@/services/indexed-db";
import { errorWrapper } from "@/utils/error-wrapper";

export default function ImportDataButtons() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportData = async (data: string) => {
    const [, error] = await errorWrapper(async () => {
      const parsedData = JSON.parse(data) as ExtensionData;

      if ("plugins" in parsedData.settings) {
        parsedData.settings = {
          settings: transfromFlatSchema(parsedData.settings),
          settings$: {
            v: 2,
          },
        };
      }

      await storage.setItem<ExtensionSettings>(
        "local:settings",
        parsedData.settings.settings,
      );
      await storage.setMeta("local:settings", {
        v: parsedData.settings["settings$"].v,
      });
      db.import(parsedData.db);
    })();

    if (!error) {
      toast({
        title: "✅ Data imported",
      });
    } else {
      console.error(error);
      toast({
        title: "❌ Invalid data",
      });
    }
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await handleImportData(await file.text());
    } catch (error) {
      console.error(error);
      toast({
        title: "❌ Failed to read file",
      });
    }

    event.target.value = "";
  };

  return (
    <div className="x:flex x:gap-4">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        className="x:hidden"
        onChange={handleFileChange}
      />
      <ImportDataPasteDialogWrapper onSubmit={handleImportData}>
        <Button variant="outline">Paste as text</Button>
      </ImportDataPasteDialogWrapper>
      <Button onClick={handleChooseFile}>Choose file</Button>
    </div>
  );
}
