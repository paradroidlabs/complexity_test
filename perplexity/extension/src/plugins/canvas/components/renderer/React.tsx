import {
  SandpackProvider,
  SandpackLayout,
  SandpackPreview,
  useSandpack,
  useActiveCode,
} from "@codesandbox/sandpack-react";

import { Button } from "@/components/ui/button";
import { useInsertCss } from "@/hooks/useInsertCss";
import useThreadCodeBlock from "@/plugins/_core/dom-observers/thread/code-blocks/hooks/useThreadCodeBlock";
import {
  formatCanvasTitle,
  getCanvasTitle,
  isAutonomousCanvasLanguageString,
} from "@/plugins/canvas/canvas.types";
import styles from "@/plugins/canvas/components/renderer/sandpack.css?inline";
import { canvasStore, useCanvasStore } from "@/plugins/canvas/store";
import { UiUtils } from "@/utils/ui-utils";

export default memo(function ReactRenderer() {
  const selectedCodeBlockLocation = useCanvasStore(
    (state) => state.selectedCodeBlockLocation,
  );

  const selectedCodeBlock = useThreadCodeBlock({
    messageBlockIndex: selectedCodeBlockLocation?.messageBlockIndex,
    codeBlockIndex: selectedCodeBlockLocation?.codeBlockIndex,
  });

  const code = selectedCodeBlock?.content.code ?? "";
  const isInFlight = selectedCodeBlock?.states.isInFlight ?? false;

  return (
    <div id="sandpack-container" className="x:relative x:size-full">
      <SandpackProvider
        template="react"
        customSetup={{
          dependencies: {
            recharts: "2.15.0",
          },
        }}
        files={{
          "/App.js": isInFlight
            ? "export default function App() { return null; }"
            : code,
        }}
        options={{
          externalResources: [
            "https://unpkg.com/@tailwindcss/ui/dist/tailwind-ui.min.css",
          ],
        }}
      >
        <PreviewContainer code={code} isInFlight={isInFlight} />
      </SandpackProvider>
    </div>
  );
});

function PreviewContainer({
  code,
  isInFlight,
}: {
  code: string;
  isInFlight: boolean;
}) {
  const { code: activeCode, updateCode } = useActiveCode();

  useEffect(() => {
    if (code !== activeCode && !isInFlight) {
      updateCode(code);
    }
  }, [activeCode, code, isInFlight, updateCode]);

  useInsertCss({
    id: "sandpack",
    css: styles,
  });

  return (
    <>
      <SandpackLayout>
        <SandpackPreview
          ref={(previewRef) => {
            canvasStore.setState({
              sandpackPreviewRef: previewRef,
            });
          }}
          showRefreshButton={false}
          showOpenInCodeSandbox={false}
        />
      </SandpackLayout>
      <FixErrorButtons />
    </>
  );
}

function FixErrorButtons() {
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

  const { sandpack } = useSandpack();

  if (!sandpack.error) return null;

  return (
    <div className="x:absolute x:bottom-4 x:left-4 x:z-10 x:flex x:flex-col x:gap-2 x:font-sans x:animate-in x:fade-in-0">
      <Button
        variant="destructive"
        onClick={() => {
          if (!sandpack.error) return;
          const $textarea = UiUtils.getActiveQueryBoxTextarea();
          if (!$textarea.length) return;
          const errorText = `${isAutonomousCanvas && title ? `An error occurred while rendering "${title}": ` : ""}\n\n${sandpack.error.message}`;
          $textarea.trigger("focus");
          document.execCommand("insertText", false, errorText);
        }}
      >
        Fix Error
      </Button>
    </div>
  );
}
