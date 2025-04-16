export function useKeyForwarding({
  queryBoxAnchor,
  commandInputRef,
  isOpen,
}: {
  queryBoxAnchor: HTMLElement | null;
  commandInputRef: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
}) {
  const $textarea = $(queryBoxAnchor ?? {}).find("textarea");

  const handleKeyForwarding = useCallback(
    (e: JQuery.KeyDownEvent) => {
      if (!isOpen) return;

      const isCmdkNavigationKeys = (
        [Key.ArrowUp, Key.ArrowDown, Key.Enter, Key.Delete] as string[]
      ).includes(e.key);

      const isCtrlKeyPressed = e.ctrlKey || e.metaKey;
      const isAllowedAlphabetKey = ["c"].includes(e.key);

      if (!isCmdkNavigationKeys && !(isCtrlKeyPressed && isAllowedAlphabetKey))
        return;

      e.preventDefault();
      e.stopPropagation();

      commandInputRef.current?.dispatchEvent(new KeyboardEvent("keydown", e));
    },
    [commandInputRef, isOpen],
  );

  useEffect(() => {
    if (!$textarea.length) return;
    $textarea.on("keydown", handleKeyForwarding);
    return () => {
      $textarea.off("keydown", handleKeyForwarding);
    };
  }, [$textarea, handleKeyForwarding]);
}
