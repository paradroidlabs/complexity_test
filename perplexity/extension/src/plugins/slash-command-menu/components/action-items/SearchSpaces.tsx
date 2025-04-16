import PplxSpace from "@/components/icons/PplxSpace";
import { CommandItem } from "@/components/ui/command";
import { commandMenuStore } from "@/data/plugins/command-menu/store";
import { slashCommandMenuStore } from "@/plugins/slash-command-menu/store";

export default function SearchSpacesActionItem() {
  const label = t(
    "plugin-slash-command-menu:slashCommandMenu.actionItems.searchSpaces.label",
  );

  return (
    <CommandItem
      value="s"
      keywords={label.split(" ")}
      className="x:min-h-10"
      onSelect={() => {
        slashCommandMenuStore.getState().actions.deleteTriggerWord();
        slashCommandMenuStore.getState().actions.setIsOpen(false);
        commandMenuStore.getState().setOpen(true);
        commandMenuStore.getState().setFilter("spaces");
      }}
    >
      <div className="x:flex x:items-center x:gap-2">
        <div className="x:flex x:items-center x:gap-2">
          <PplxSpace className="x:size-4" />
          <div>{label}</div>
        </div>
      </div>
    </CommandItem>
  );
}
