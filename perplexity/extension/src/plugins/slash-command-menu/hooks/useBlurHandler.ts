export function useBlurHandler({
  queryBoxAnchor,
  commandRef,
  setIsOpen,
}: {
  queryBoxAnchor: HTMLElement | null;
  commandRef: React.RefObject<HTMLElement | null>;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const $textarea = $(queryBoxAnchor ?? {}).find("textarea");

  const handleBlur = useCallback(
    (e: JQuery.BlurEvent) => {
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      const shouldKeepOpen =
        relatedTarget &&
        (commandRef.current?.contains(relatedTarget) ||
          commandRef.current === relatedTarget ||
          relatedTarget === $textarea[0]);

      if (shouldKeepOpen) return;
      setIsOpen(false);
    },
    [$textarea, commandRef, setIsOpen],
  );

  useEffect(() => {
    if (!$textarea.length) return;
    $textarea.on("blur", handleBlur);
    return () => {
      $textarea.off("blur", handleBlur);
    };
  }, [$textarea, handleBlur]);
}
