import type { DialogOpenChangeDetails } from "@ark-ui/react";
import { useNavigate } from "react-router-dom";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { PluginRegistry } from "@/data/plugin-registry/index";
import type { PluginId } from "@/data/plugin-registry/types";
import { PLUGIN_SETTINGS_UIS } from "@/entrypoints/options-page/dashboard/pages/plugins/components/plugin-settings-uis/loader";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

type PluginSettingsModalProps = {
  pluginId: PluginId;
};

export default function PluginSettingsModal({
  pluginId,
}: PluginSettingsModalProps) {
  const navigate = useNavigate();
  const { isMobile } = useIsMobileStore();

  const handleClose = ({ open }: DialogOpenChangeDetails) => {
    if (!open) {
      navigate("/plugins");
    }
  };

  const DialogComp = isMobile ? Sheet : Dialog;
  const DialogContentComp = isMobile ? SheetContent : DialogContent;

  return (
    <DialogComp open onOpenChange={handleClose}>
      <DialogContentComp
        className="x:md:max-w-max"
        side={isMobile ? "bottom" : undefined}
      >
        <DialogHeader>
          <DialogTitle>{PluginRegistry.manifests[pluginId].title}</DialogTitle>
          <DialogDescription className="x:whitespace-pre-line">
            {PluginRegistry.manifests[pluginId].description}
          </DialogDescription>
        </DialogHeader>
        <div className="x:mt-4">{PLUGIN_SETTINGS_UIS[pluginId]}</div>
      </DialogContentComp>
    </DialogComp>
  );
}
