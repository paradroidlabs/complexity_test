import { LuTrash2 } from "react-icons/lu";

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

type DeleteButtonProps = {
  isDeleting: boolean;
  onDelete: () => void;
};

export function DeleteButton({ isDeleting, onDelete }: DeleteButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog
      unmountOnExit
      open={isOpen}
      onOpenChange={({ open }) => setIsOpen(open)}
    >
      <DialogTrigger asChild>
        <Button type="button" variant="outline" size="icon">
          <LuTrash2 />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Theme</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this theme? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={onDelete}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
