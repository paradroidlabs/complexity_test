import { LuCopy } from "react-icons/lu";

import FaFileExport from "@/components/icons/FaFileExport";
import { Button } from "@/components/ui/button";

type ExportActionsProps = {
  onDownload: () => void;
  onCopy: () => void;
};

export function ExportActions({ onDownload, onCopy }: ExportActionsProps) {
  return (
    <div className="x:flex x:gap-2">
      <Button className="x:flex x:items-center x:gap-2" onClick={onDownload}>
        <FaFileExport className="x:size-4" />
        <span>{t("plugin-export-thread:exportButton.actions.download")}</span>
      </Button>
      <Button className="x:flex x:items-center x:gap-2" onClick={onCopy}>
        <LuCopy className="x:size-4" />
        <span>{t("plugin-export-thread:exportButton.actions.copy")}</span>
      </Button>
    </div>
  );
}
