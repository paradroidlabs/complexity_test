import type { CSSProperties, ReactNode } from "react";

import CodeHighlighter from "@/components/CodeHighlighter";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { getInterpretedCanvasLanguage } from "@/plugins/canvas/canvas.types";
import { useCanvasStore } from "@/plugins/canvas/store";

export default function CodeView() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );
  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const isInFlight = selectedCodeBlock?.states.isInFlight;
  const codeString = selectedCodeBlock?.content.code ?? "";
  const language = getInterpretedCanvasLanguage(
    selectedCodeBlock?.content.language ?? "",
  );

  const lineNumberStyle = useMemo((): CSSProperties => {
    return {
      color: "oklch(var(--muted-foreground))",
    };
  }, []);

  const preTag = useMemo(() => {
    const PreComponent = ({ children }: { children: ReactNode }) => (
      <pre className="x:px-4 x:py-2">{children}</pre>
    );
    PreComponent.displayName = "PreTag";
    return PreComponent;
  }, []);

  return (
    <div
      id="canvas-code-view"
      className={cn(
        "x:h-full x:w-max x:min-w-full x:text-xs x:[&_span.linenumber]:!text-muted-foreground x:[&>pre]:m-0 x:[&>pre]:size-full x:[&>pre]:rounded-t-none",
        {
          "x:[&_span]:duration-300 x:[&_span]:animate-in x:[&_span]:fade-in":
            isInFlight,
        },
      )}
    >
      <CodeHighlighter
        showLineNumbers
        language={language}
        lineNumberStyle={lineNumberStyle}
        PreTag={preTag}
      >
        {codeString}
      </CodeHighlighter>
    </div>
  );
}
