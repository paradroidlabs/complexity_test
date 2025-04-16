import isEqual from "lodash/isEqual";
import type { ComponentProps, ComponentType, SVGProps } from "react";
import { LuArrowRight, LuCheck, LuRocket, LuZap } from "react-icons/lu";
import { useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { PluginRegistry } from "@/data/plugin-registry/index";
import {
  ALL_PLUGINS,
  ESSENTIALS_ONLY,
  POWER_USER,
} from "@/entrypoints/options-page/dashboard/pages/plugins/predefined-configs";
import type { ExtensionSettings } from "@/services/extension-settings/types";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

export default function PluginsEnableSet() {
  const { settings } = useExtensionSettings();

  const [searchParams] = useSearchParams();

  const isDefaultSettings = useMemo(
    () => isEqual(settings?.plugins, PluginRegistry.fallbackValues),
    [settings],
  );

  const [open, setOpen] = useState(
    searchParams.get("from") === "onboarding" && isDefaultSettings,
  );

  const navigate = useNavigate();

  return (
    <Dialog
      unmountOnExit
      lazyMount
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
    >
      <DialogTrigger asChild>
        <Button variant="link" className="x:p-0">
          Don&apos;t know where to start? Try presets!
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Plugin Presets</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Predefined sets of plugins to help you get started.
        </DialogDescription>

        {!isDefaultSettings && (
          <div className="x:flex x:flex-col x:gap-2">
            <div className="x:text-sm x:text-yellow-300">
              Presets will override your current settings. Please make sure to
              save your current settings before applying.
            </div>
          </div>
        )}

        <div className="x:flex x:flex-col x:gap-2">
          <PresetButton
            label="Essentials Only"
            LabelIcon={LuCheck}
            description="You are new to Perplexity and using the extension for the first time."
            config={ESSENTIALS_ONLY}
            className="x:border-primary/50"
            onComplete={() => setOpen(false)}
          />
          <PresetButton
            label="Power User"
            LabelIcon={LuZap}
            description="You have used Perplexity for a while and want to make the most out of it."
            config={POWER_USER}
            className="x:border-primary/50"
            onComplete={() => setOpen(false)}
          />
          <PresetButton
            label="YOLO"
            LabelIcon={LuRocket}
            description="Enable all plugins without knowing what they do is NOT recommended. Please start exploring them first."
            config={ALL_PLUGINS}
            onComplete={() => setOpen(false)}
          />
        </div>

        <div className="x:text-sm x:text-muted-foreground">
          There are many plugins that depend on personal preferences. Feel free
          to test and enable them as you see fit.
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => navigate("/")}>
              I&apos;ll look around by myself
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PresetButton({
  label,
  LabelIcon,
  description,
  config,
  onComplete,
  className,
  ...props
}: {
  label: string;
  LabelIcon: ComponentType<SVGProps<SVGSVGElement>>;
  description: string;
  config: ExtensionSettings["plugins"];
  onComplete: () => void;
} & ComponentProps<"button">) {
  const { mutation } = useExtensionSettings();

  return (
    <Dialog lazyMount unmountOnExit>
      <DialogTrigger asChild>
        <button
          className={cn(
            "x:group x:flex x:flex-col x:rounded-lg x:border x:border-border/50 x:bg-secondary x:p-4 x:text-left x:transition-all x:hover:border-primary x:hover:bg-primary/10",
            className,
          )}
          {...props}
        >
          <div className="x:flex x:w-full x:items-center x:justify-between x:gap-2">
            <div className="x:flex x:items-center x:gap-2">
              <LabelIcon className="x:group-hover:text-primary" />
              <div className="x:text-lg x:group-hover:text-primary">
                {label}
              </div>
            </div>
            <LuArrowRight className="x:hidden x:animate-in x:fade-in x:spin-in-90 x:group-hover:block" />
          </div>
          <div className="x:text-sm x:text-muted-foreground">{description}</div>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Apply Plugin Preset</DialogTitle>
        </DialogHeader>
        Are you sure you want to apply the &quot;{label}&quot; preset?
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose
            asChild
            onClick={() => {
              mutation.mutate((draft) => {
                draft.plugins = config;
              });
              toast({
                description: `✅ Preset "${label}" applied successfully!`,
              });
              onComplete();
            }}
          >
            <Button>Apply</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
