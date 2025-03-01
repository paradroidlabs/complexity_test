import MarkdownRendererComponent from "@/components/MarkdownRenderer";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import { useCanvasStore } from "@/plugins/canvas/store";

export default function MarkdownRenderer() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.content.code;

  return (
    <div className="x-prose x-mx-auto x-p-4 x-py-8 dark:x-prose-invert">
      <MarkdownRendererComponent markdown={code ?? ""} />
    </div>
  );
}
