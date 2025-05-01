import { asyncLoaderRegistry } from "@/plugins/_core/async-dep-registry";
import { threadCodeBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/code-blocks/store";
import type { CodeBlock } from "@/plugins/_core/dom-observers/thread/code-blocks/types";
import {
  spaRouteChangeCompleteSubscribe,
  spaRouterStoreSubscribe,
} from "@/plugins/_core/main-world/spa-router/listeners.loader";
import { CANVAS_PLACEHOLDERS } from "@/plugins/canvas/canvases";
import {
  canvasStore,
  type CanvasBlock,
  type CodeBlockLocation,
} from "@/plugins/canvas/store";
import type { CanvasLanguage } from "@/plugins/canvas/types";
import {
  formatCanvasTitle,
  getCanvasTitle,
  getInterpretedCanvasLanguage,
  isAutonomousCanvasLanguageString,
} from "@/plugins/canvas/utils";
import { DomSelectorsService } from "@/services/cplx-api/versioned-remote-resources/dom-selectors";
import { parseUrl, scrollToElement, whereAmI } from "@/utils/utils";

declare module "@/plugins/_core/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "plugin:thread:canvas:resetOpenStateOnRouteChange": void;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "plugin:thread:canvas:resetOpenStateOnRouteChange",
    dependencies: ["cache:pluginsStates"],
    loader: ({ "cache:pluginsStates": pluginsStates }) => {
      const isCanvasEnabled = pluginsStates["thread:canvas"];
      if (!isCanvasEnabled) return;

      spaRouteChangeCompleteSubscribe((url) => {
        if (whereAmI(url) !== "thread")
          canvasStore.setState({
            isCanvasListOpen: false,
            selectedCodeBlockLocation: null,
          });
      });

      initializeAutonomousMode();

      emitResizeEvent();

      closeOnRouteChange();
    },
  });
}

const initializeAutonomousMode = () => {
  threadCodeBlocksDomObserverStore.subscribe(
    (store) => store.codeBlocksChunks,
    (codeBlocksChunks, prevCodeBlocksChunks) => {
      if (!codeBlocksChunks || !prevCodeBlocksChunks) return;

      const getTotalBlocks = (chunks: CodeBlock[][]) =>
        chunks.reduce((acc, blocks) => acc + blocks.length, 0);

      if (
        getTotalBlocks(codeBlocksChunks) !==
        getTotalBlocks(prevCodeBlocksChunks)
      ) {
        canvasStore.getState().setLastAutoOpenCodeBlockLocation(null);
      }
    },
    {
      equalityFn: deepEqual,
    },
  );

  threadCodeBlocksDomObserverStore.subscribe(
    (store) => store.codeBlocksChunks,
    (codeBlocksChunks) => {
      if (!codeBlocksChunks) return;

      requestIdleCallback(
        () => {
          const newCanvasBlocks: Record<string, CanvasBlock> = {};

          codeBlocksChunks.forEach((chunks, chunkIndex) => {
            chunks.forEach((codeBlock, codeBlockIndex) => {
              if (
                codeBlock == null ||
                !codeBlock.content.language ||
                !isAutonomousCanvasLanguageString(codeBlock.content.language)
              )
                return;

              const key = getCanvasTitle(codeBlock.content.language);
              const interpretedLanguage = getInterpretedCanvasLanguage(
                codeBlock.content.language,
              );

              if (!(interpretedLanguage in CANVAS_PLACEHOLDERS)) return;

              updateCanvasBlocks({
                key,
                newCanvasBlocks,
                codeBlock,
                messageBlockIndex: chunkIndex,
                codeBlockIndex,
                interpretedLanguage: interpretedLanguage as CanvasLanguage,
              });
            });
          });

          canvasStore.setState((draft) => {
            draft.canvasBlocks = newCanvasBlocks;
          });
        },
        { timeout: 2000 },
      );
    },
    {
      equalityFn: deepEqual,
    },
  );
};

const updateCanvasBlocks = ({
  newCanvasBlocks,
  key,
  codeBlock,
  messageBlockIndex,
  codeBlockIndex,
  interpretedLanguage,
}: {
  newCanvasBlocks: Record<string, CanvasBlock>;
  key: string;
  codeBlock: any;
  messageBlockIndex: number;
  codeBlockIndex: number;
  interpretedLanguage: CanvasLanguage;
}) => {
  const location = { messageBlockIndex, codeBlockIndex };
  const placeholder = CANVAS_PLACEHOLDERS[interpretedLanguage];
  const title = formatCanvasTitle(key) || placeholder.defaultTitle;

  if (newCanvasBlocks[key]) {
    newCanvasBlocks[key].count++;
    newCanvasBlocks[key].isInFlight = codeBlock.isInFlight;
    newCanvasBlocks[key].location.push(location);
  } else {
    newCanvasBlocks[key] = {
      Icon: placeholder.icon,
      title,
      description: placeholder.description,
      onClick: () =>
        handleCanvasBlockClick({
          messageBlockIndex:
            newCanvasBlocks[key]?.location.at(-1)?.messageBlockIndex ?? 0,
          codeBlockIndex:
            newCanvasBlocks[key]?.location.at(-1)?.codeBlockIndex ?? 0,
        }),
      isInFlight: codeBlock.isInFlight,
      count: 1,
      location: [location],
    };
  }
};

const handleCanvasBlockClick = (location: CodeBlockLocation) => {
  canvasStore.setState((draft) => {
    draft.isCanvasListOpen = false;
    draft.selectedCodeBlockLocation = location;
    draft.state = "preview";

    const selector = `[data-cplx-component="${DomSelectorsService.internalAttributes.THREAD.MESSAGE.BLOCK}"][data-index="${location.messageBlockIndex}"] [data-cplx-component="${DomSelectorsService.internalAttributes.THREAD.MESSAGE.MIRRORED_CODE_BLOCK}"][data-index="${location.codeBlockIndex}"]`;
    scrollToElement($(selector), -100);
  });
};

const closeOnRouteChange = () => {
  spaRouterStoreSubscribe(
    (store) => ({ state: store.state, url: store.url }),
    ({ state, url }, { url: prevUrl }) => {
      if (state !== "complete" && url === prevUrl) return;

      if (
        parseUrl(prevUrl).queryParams.get("q") != null ||
        parseUrl(url).queryParams.get("q") != null
      )
        return;

      canvasStore.getState().close();
    },
  );
};

const emitResizeEvent = () => {
  canvasStore.subscribe((state, prevState) => {
    if (
      state.selectedCodeBlockLocation !== prevState.selectedCodeBlockLocation ||
      state.isCanvasListOpen !== prevState.isCanvasListOpen
    ) {
      setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
    }
  });
};
