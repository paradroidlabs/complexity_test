import { useMutation } from "@tanstack/react-query";
import { LuLoaderCircle } from "react-icons/lu";
import { sendMessage } from "webext-bridge/content-script";

import { Button } from "@/components/ui/button";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useColorSchemeStore } from "@/plugins/_core/global-stores/color-scheme-store";
import { getActiveQueryBoxTextarea } from "@/plugins/_core/ui/groups/query-box/utils";
import { useCanvasStore } from "@/plugins/canvas/store";
import {
  formatCanvasTitle,
  getCanvasTitle,
  isAutonomousCanvasLanguageString,
} from "@/plugins/canvas/utils";

export default function MermaidRenderer() {
  const { colorScheme } = useColorSchemeStore();

  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const isAutonomousCanvas = isAutonomousCanvasLanguageString(
    selectedCodeBlock?.content.language,
  );
  const title = formatCanvasTitle(
    getCanvasTitle(selectedCodeBlock?.content.language),
  );

  const code = selectedCodeBlock?.content.code;
  const isInFlight = selectedCodeBlock?.states.isInFlight;

  const [refreshKey, refreshContainer] = useReducer((state) => state + 1, 0);

  const {
    mutate,
    isPending,
    isSuccess: mermaidRendererResponded,
    data: result,
  } = useMutation({
    mutationFn: async () => {
      return await sendMessage(
        "mermaidRenderer:render",
        {
          selector: `#canvas-mermaid-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`,
        },
        "window",
      );
    },
  });

  const isSuccess = result?.success;

  useEffect(() => {
    if (isInFlight) return;

    refreshContainer();
    setTimeout(() => {
      mutate();
    }, 0);
  }, [mutate, code, colorScheme, isInFlight]);

  return (
    <div key={refreshKey} className="x:relative x:size-full">
      {!isPending &&
        mermaidRendererResponded &&
        !isSuccess &&
        !result?.error && (
          <div className="x:absolute x:inset-1/2 x:w-max x:-translate-x-1/2 x:-translate-y-1/2">
            <span className="x:animate-in x:fade-in">
              Failed to render provided mermaid code. Try to reload the Canvas.
            </span>
          </div>
        )}
      {!isPending &&
        mermaidRendererResponded &&
        !isSuccess &&
        result?.error && (
          <div className="x:flex x:flex-col x:gap-4 x:p-4 x:font-mono">
            <div className="x:text-lg x:font-bold x:text-destructive">
              An error occurred while rendering:
            </div>
            <div className="x:whitespace-pre x:animate-in x:fade-in">
              {result.error}
            </div>
            <Button
              className="x:w-max"
              variant="destructive"
              onClick={() => {
                const $textarea = getActiveQueryBoxTextarea();
                if (!$textarea.length) return;

                const errorText = `${isAutonomousCanvas && title ? `An error occurred while rendering "${title}": ` : ""}\n\n${result.error}`;

                $textarea.trigger("focus");
                document.execCommand("insertText", false, errorText);
              }}
            >
              Fix Error
            </Button>
          </div>
        )}
      <div
        id={`canvas-mermaid-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`}
        className={cn("x:size-full x:text-secondary x:transition-opacity", {
          "x:opacity-0": !mermaidRendererResponded || !isSuccess,
        })}
      >
        {code}
      </div>
      {(isPending || isSuccess == null) && (
        <div className="x:absolute x:inset-1/2 x:-translate-x-1/2 x:-translate-y-1/2 x:animate-in x:fade-in">
          <LuLoaderCircle className="x:size-10 x:animate-spin x:text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
