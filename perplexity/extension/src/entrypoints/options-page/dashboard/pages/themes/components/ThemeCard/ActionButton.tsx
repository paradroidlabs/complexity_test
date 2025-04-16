import Tooltip from "@/components/Tooltip";
import { Switch } from "@/components/ui/switch";
import type { Theme } from "@/data/plugins/themes/theme-registry.types";
import useExtensionSettings from "@/services/extension-settings/useExtensionSettings";

type ThemeActionButtonProps = {
  theme: Theme;
};

export default function ThemeCardActionButton({
  theme,
}: ThemeActionButtonProps) {
  const { settings, mutation } = useExtensionSettings();

  const isChosenTheme = settings?.theme === theme?.id;

  const handleThemeAction = useCallback(() => {
    mutation.mutate((draft) => {
      draft.theme = isChosenTheme ? "" : theme.id;
    });
  }, [mutation, isChosenTheme, theme]);

  return (
    <Tooltip content={isChosenTheme ? "Disable" : "Enable"}>
      <Switch checked={isChosenTheme} onCheckedChange={handleThemeAction} />
    </Tooltip>
  );
}
