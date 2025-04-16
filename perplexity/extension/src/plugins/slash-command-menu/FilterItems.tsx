import CsUiPluginsGuard from "@/plugins/_core/plugins-guard/CsUiPluginsGuard";
import PromptHistoryFilterItem from "@/plugins/slash-command-menu/components/filter-items/PromptHistory";

const FILTER_MODES = ["promptHistory"] as const;

export type FilterMode = (typeof FILTER_MODES)[number];

export default function FilterItems() {
  return (
    <CsUiPluginsGuard
      dependentPluginIds={["queryBox:slashCommandMenu:promptHistory"]}
    >
      <PromptHistoryFilterItem />
    </CsUiPluginsGuard>
  );
}
