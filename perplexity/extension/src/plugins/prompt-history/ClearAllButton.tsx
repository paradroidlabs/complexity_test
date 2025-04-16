import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getPromptHistoryService } from "@/services/indexed-db/prompt-history";
import { promptHistoryQueries } from "@/services/indexed-db/prompt-history/query-keys";
import { queryClient } from "@/utils/ts-query-client";

export default function ClearAllButton() {
  const [isOpen, setIsOpen] = useState(false);

  const handleClearAll = () => {
    getPromptHistoryService().deleteAll();
    queryClient.invalidateQueries({
      queryKey: promptHistoryQueries.infinite._def,
    });
    setIsOpen(false);
  };

  return (
    <Dialog
      lazyMount
      unmountOnExit
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <div className="x:ml-auto x:cursor-pointer x:text-xs x:text-muted-foreground x:transition-colors x:hover:text-foreground x:hover:underline">
          {t(
            "plugin-slash-command-menu:slashCommandMenu.filterItems.promptHistory.clearButton.label",
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t(
              "plugin-slash-command-menu:slashCommandMenu.filterItems.promptHistory.clearButton.dialog.title",
            )}
          </DialogTitle>
          <DialogDescription>
            {t(
              "plugin-slash-command-menu:slashCommandMenu.filterItems.promptHistory.clearButton.dialog.description",
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            {t(
              "plugin-slash-command-menu:slashCommandMenu.filterItems.promptHistory.clearButton.dialog.actions.cancel",
            )}
          </Button>
          <Button variant="destructive" onClick={handleClearAll}>
            {t(
              "plugin-slash-command-menu:slashCommandMenu.filterItems.promptHistory.clearButton.dialog.actions.confirm",
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
