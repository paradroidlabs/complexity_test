import { LuTrash } from "react-icons/lu";

import CopyButton from "@/components/CopyButton";
import { CommandItem } from "@/components/ui/command";
import { slashCommandMenuStore } from "@/plugins/slash-command-menu/store";
import { formatHowLongAgo } from "@/utils/dayjs";

type PromptHistoryItem = {
  id: string;
  prompt: string;
  createdAt: string;
  keywords: string[];
};

export default function PromptHistoryItem({
  item,
  isHighlighted,
  onDelete,
}: {
  item: PromptHistoryItem;
  isHighlighted: boolean;
  onDelete: (id: string) => void;
}) {
  const copyButtonRef = useRef<HTMLDivElement>(null);

  return (
    <CommandItem
      key={item.id}
      value={item.id}
      keywords={item.keywords}
      onSelect={() => {
        slashCommandMenuStore.getState().actions.setIsOpen(false);
        slashCommandMenuStore.getState().actions.insertTextAtCaret(item.prompt);
      }}
      onKeyDown={(e) => {
        if (e.key === Key.Delete) {
          onDelete(item.id);
        } else if (e.ctrlKey && e.key === "c") {
          copyButtonRef.current?.click();
        }
      }}
    >
      <div className="x:flex x:w-full x:items-start x:justify-between x:gap-4">
        <div className="x:min-w-0 x:flex-1">
          <div className="x:line-clamp-3 x:break-words x:whitespace-pre-wrap">
            {item.prompt.trim()}
          </div>
        </div>
        <div className="x:flex x:shrink-0 x:items-center x:gap-2 x:text-xs x:text-muted-foreground">
          {isHighlighted && (
            <>
              <CopyButton
                ref={copyButtonRef}
                content={item.prompt}
                iconProps={{ className: "x:size-3" }}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              />
              <div
                className="x:text-muted-foreground x:transition-colors x:hover:text-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(item.id);
                }}
              >
                <LuTrash />
              </div>
            </>
          )}
          <div>{formatHowLongAgo(item.createdAt)}</div>
        </div>
      </div>
    </CommandItem>
  );
}
