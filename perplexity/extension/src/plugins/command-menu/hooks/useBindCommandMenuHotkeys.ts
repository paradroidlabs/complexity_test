import { useHotkeys } from "react-hotkeys-hook";

import type { SearchFilter } from "@/data/plugins/command-menu/items";
import {
  commandMenuStore,
  useCommandMenuStore,
} from "@/data/plugins/command-menu/store";
import { toggleZenMode } from "@/data/plugins/zen-mode/utils";
import { ExtensionSettingsService } from "@/services/extension-settings";
import { PluginsStatesService } from "@/services/plugins-states";
import { keysToString } from "@/utils/utils";

export default function useBindCommandMenuHotkeys() {
  const pluginsStates = PluginsStatesService.getEnableStatesCachedSync();

  const settings = ExtensionSettingsService.cachedSync;

  const { open, setOpen, filter } = useCommandMenuStore();

  const [historyPosition, setHistoryPosition] = useState(-1);
  const [filterHistory, setFilterHistory] = useState<(SearchFilter | null)[]>(
    [],
  );

  const activationHotkey = settings.plugins.commandMenu.hotkey ?? [];

  useHotkeys(
    keysToString(activationHotkey),
    (e) => {
      e.stopImmediatePropagation();
      setOpen(!open);
    },
    {
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
    [activationHotkey],
  );

  useEffect(() => {
    setFilterHistory((prev) => {
      if (prev[historyPosition] === filter) {
        return prev;
      }

      const newHistory = prev.slice(0, historyPosition + 1);
      const updatedHistory = [...newHistory, filter];
      setHistoryPosition(updatedHistory.length - 1);
      return updatedHistory;
    });
  }, [filter, historyPosition]);

  useHotkeys(
    [
      keysToString([Key.Alt, Key.ArrowLeft]),
      keysToString([Key.Alt, Key.ArrowRight]),
    ],
    (e) => {
      if (filterHistory.length < 2) return;

      const isBackward = e.key === "ArrowLeft";
      const newPosition = isBackward
        ? Math.max(0, historyPosition - 1)
        : Math.min(filterHistory.length - 1, historyPosition + 1);

      if (newPosition === historyPosition) return;

      setHistoryPosition(newPosition);
      commandMenuStore.setState({
        filter: filterHistory[newPosition],
      });
    },
    {
      enabled: open,
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );

  useHotkeys(
    keysToString(settings.plugins.zenMode.hotkey),
    () => {
      toggleZenMode();
      setOpen(false);
    },
    {
      enabled: pluginsStates["zenMode"],
      preventDefault: true,
      enableOnContentEditable: true,
      enableOnFormTags: true,
    },
  );
}
