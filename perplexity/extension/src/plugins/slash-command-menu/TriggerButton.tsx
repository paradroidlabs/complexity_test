import { LuSquareSlash } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useRegisterGlobalCssEntry } from "@/plugins/_core/global-stores/global-css-store";
import { useScopedQueryBoxContext } from "@/plugins/_core/ui/groups/query-box/context/context";
import { UiUtils } from "@/utils/ui-utils";

export function TriggerButton() {
  const { store } = useScopedQueryBoxContext();

  const subscriberId = "slash-command-menu";

  useRegisterGlobalCssEntry({
    entryIds: ["normalize-main-query-box"],
    subscriberId,
    subscribe: store.type === "main",
  });

  const handleTrigger = async () => {
    const $activeQueryBoxTextarea = UiUtils.getActiveQueryBoxTextarea();

    if (!$activeQueryBoxTextarea.length) return;

    $activeQueryBoxTextarea.trigger("focus");

    const textarea = $activeQueryBoxTextarea[0] as HTMLTextAreaElement;
    const { selectionStart, value } = textarea;

    // Check characters before and after cursor
    const needsSpaceBefore =
      selectionStart > 0 && value[selectionStart - 1] !== " ";
    const needsSpaceAfter =
      selectionStart < value.length && value[selectionStart] !== " ";

    let textToInsert = "";
    if (needsSpaceBefore) textToInsert += " ";
    textToInsert += "/";
    if (needsSpaceAfter) textToInsert += " ";

    const event = new KeyboardEvent("keydown", {
      key: "/",
      bubbles: true,
      cancelable: true,
    });
    textarea.dispatchEvent(event);

    document.execCommand("insertText", false, textToInsert);

    // Calculate new caret position (right after the slash)
    const newPosition = selectionStart + (needsSpaceBefore ? 2 : 1);
    textarea.setSelectionRange(newPosition, newPosition);
  };

  return (
    <Tooltip
      content={t(
        "plugin-slash-command-menu:slashCommandMenu.triggerButton.label",
      )}
    >
      <button
        className="x:flex x:size-8 x:cursor-pointer x:items-center x:justify-center x:gap-1 x:rounded-lg x:text-center x:text-sm x:font-medium x:text-muted-foreground x:transition-all x:duration-150 x:outline-none x:placeholder:text-muted-foreground x:hover:bg-primary-foreground x:hover:text-foreground x:focus-visible:bg-primary-foreground x:focus-visible:outline-none x:active:scale-95 x:disabled:cursor-not-allowed x:disabled:opacity-50 x:[&>span]:!truncate"
        onClick={handleTrigger}
      >
        <LuSquareSlash className="x:size-4" />
      </button>
    </Tooltip>
  );
}
