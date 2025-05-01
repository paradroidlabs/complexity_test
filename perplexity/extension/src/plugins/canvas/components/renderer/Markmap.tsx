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

export default function MarkmapRenderer() {
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

  const {
    mutate,
    isPending,
    isSuccess: markmapRendererResponded,
    data: result,
  } = useMutation({
    mutationFn: async ({ code }: { code: string }) => {
      return await sendMessage(
        "markmapRenderer:render",
        {
          selector: `#canvas-markmap-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`,
          content: code,
        },
        "window",
      );
    },
  });

  const isSuccess = result?.success;

  useEffect(() => {
    if (!code) return;

    mutate({ code });
  }, [mutate, code, colorScheme]);

  return (
    <div className="x:relative x:size-full">
      {!isPending &&
        markmapRendererResponded &&
        !isSuccess &&
        !result?.error && (
          <div className="x:absolute x:inset-1/2 x:w-max x:-translate-x-1/2 x:-translate-y-1/2">
            <span className="x:animate-in x:fade-in">
              Failed to render provided markmap code. Try to reload the Canvas.
            </span>
          </div>
        )}
      {!isPending &&
        markmapRendererResponded &&
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
      <svg
        id={`canvas-markmap-container-${selectedCodeBlockLocation?.messageBlockIndex}-${selectedCodeBlockLocation?.codeBlockIndex}`}
        className={cn(
          "x:size-full x:!font-sans x:!text-foreground x:transition-opacity",
          {
            "x:opacity-0": !markmapRendererResponded || !isSuccess,
          },
        )}
      />
      {(isPending || isSuccess == null) && (
        <div className="x:absolute x:inset-1/2 x:-translate-x-1/2 x:-translate-y-1/2 x:animate-in x:fade-in">
          <LuLoaderCircle className="x:size-10 x:animate-spin x:text-muted-foreground" />
        </div>
      )}
    </div>
  );
}
