import { CommandInput } from "@/components/ui/command";
import { useSlashCommandMenuSearchValue } from "@/plugins/slash-command-menu/store";
import { handleCommandInputKeyDown } from "@/plugins/slash-command-menu/utils";

type CommandInputHandlerProps = {
  commandRef: React.RefObject<HTMLDivElement | null>;
  commandInputRef: React.RefObject<HTMLInputElement | null>;
};

export const CommandInputHandler = memo(
  ({ commandRef, commandInputRef }: CommandInputHandlerProps) => {
    const searchValue = useSlashCommandMenuSearchValue();

    const onKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) =>
        handleCommandInputKeyDown(commandRef)(e),
      [commandRef],
    );

    return (
      <CommandInput
        ref={commandInputRef}
        value={searchValue}
        className="x:hidden"
        onKeyDown={onKeyDown}
      />
    );
  },
);

CommandInputHandler.displayName = "CommandInputHandler";
