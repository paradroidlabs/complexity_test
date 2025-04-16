import { useBlurHandler } from "@/plugins/slash-command-menu/hooks/useBlurHandler";
import { useKeyForwarding } from "@/plugins/slash-command-menu/hooks/useKeyForwarding";
import { useSlashCommandState } from "@/plugins/slash-command-menu/hooks/useSlashCommandState";
import { useSlashCommandMenuStore } from "@/plugins/slash-command-menu/store";

type QueryBoxObserverProps = {
  queryBoxAnchor: HTMLElement | null;
  commandRef: React.RefObject<HTMLElement | null>;
  commandInputRef: React.RefObject<HTMLElement | null>;
};

export default function useQueryBoxObserver({
  queryBoxAnchor,
  commandRef,
  commandInputRef,
}: QueryBoxObserverProps) {
  const {
    isOpen,
    actions: { setIsOpen, setSearchValue },
  } = useSlashCommandMenuStore();

  useBlurHandler({ queryBoxAnchor, commandRef, setIsOpen });
  useKeyForwarding({ queryBoxAnchor, commandInputRef, isOpen });
  useSlashCommandState({ queryBoxAnchor, isOpen, setIsOpen, setSearchValue });
}
