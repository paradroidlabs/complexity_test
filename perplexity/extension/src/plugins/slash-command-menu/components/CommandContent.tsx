import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandList,
} from "@/components/ui/command";
import { PopoverContent } from "@/components/ui/popover";
import type { QueryBoxType } from "@/data/plugins/query-box/types";
import PromptHistorySlashMenuItemsWrapper from "@/plugins/prompt-history/Wrapper";
import ActionItems from "@/plugins/slash-command-menu/ActionItems";
import { CommandInputHandler } from "@/plugins/slash-command-menu/components/CommandInputHandler";
import FilterItems from "@/plugins/slash-command-menu/FilterItems";
import {
  useSlashCommandMenuSelectedValue,
  useSlashCommandMenuActions,
  useSlashCommandMenuFilter,
} from "@/plugins/slash-command-menu/store";
import { useCommandFilter } from "@/plugins/slash-command-menu/useCommandFilter";

type CommandContentProps = {
  commandRef: React.RefObject<HTMLDivElement | null>;
  commandInputRef: React.RefObject<HTMLInputElement | null>;
  anchor: HTMLElement;
  storeType: QueryBoxType;
};

const DefaultCommandGroup = memo(() => (
  <CommandGroup>
    <FilterItems />
    <ActionItems />
  </CommandGroup>
));

DefaultCommandGroup.displayName = "DefaultCommandGroup";

export const CommandContent = memo((props: CommandContentProps) => {
  const { storeType, anchor } = props;
  const selectedValue = useSlashCommandMenuSelectedValue();
  const { setSelectedValue } = useSlashCommandMenuActions();
  const filter = useSlashCommandMenuFilter();

  const { shouldFilterItems, calculateFilterScore } = useCommandFilter();

  const memoizedFilter = useCallback(
    (value: string, search: string) => {
      return calculateFilterScore(value, search, undefined, filter);
    },
    [calculateFilterScore, filter],
  );

  const handleValueChange = useCallback(
    (value: string) => setSelectedValue(value),
    [setSelectedValue],
  );

  return (
    <PopoverContent
      ref={props.commandRef}
      className={cn(
        "x:overflow-y-auto x:border-border x:p-0 x:font-medium x:shadow-none",
        {
          "x:rounded-b-none x:border-2 x:border-b-0": storeType !== "space",
          "x:rounded-t-none x:border-2 x:border-t-0": storeType === "space",
        },
      )}
      portal={false}
      style={{ width: anchor.clientWidth }}
    >
      <Command
        filter={memoizedFilter}
        shouldFilter={shouldFilterItems(filter)}
        value={selectedValue}
        className={cn("x:bg-background x:dark:bg-secondary", {
          "x:rounded-b-none": storeType !== "space",
          "x:rounded-t-none": storeType === "space",
        })}
        onValueChange={handleValueChange}
      >
        <CommandInputHandler {...props} />
        <CommandList className="x:max-h-[200px] x:p-1">
          <CommandEmpty>No results found</CommandEmpty>
          {!filter && <DefaultCommandGroup />}
          {filter === "promptHistory" && <PromptHistorySlashMenuItemsWrapper />}
        </CommandList>
      </Command>
    </PopoverContent>
  );
});

CommandContent.displayName = "CommandContent";
