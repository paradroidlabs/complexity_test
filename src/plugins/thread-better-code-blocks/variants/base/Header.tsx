import { LuLoaderCircle } from "react-icons/lu";

import CopyButton from "@/components/CopyButton";
import { Separator } from "@/components/ui/separator";
import { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import { useThreadMessageBlocksDomObserverStore } from "@/plugins/_core/dom-observers/thread/message-blocks/store";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";
import { getBetterCodeBlockOptions } from "@/plugins/thread-better-code-blocks/utils";
import CanvasSimpleModeRenderButton from "@/plugins/thread-better-code-blocks/variants/base/header-buttons/CanvasSimpleModeRenderButton";
import { ExpandCollapseButton } from "@/plugins/thread-better-code-blocks/variants/base/header-buttons/ExpandCollapseButton";
import { WrapToggleButton } from "@/plugins/thread-better-code-blocks/variants/base/header-buttons/WrapToggleButton";
import { ExtensionLocalStorageService } from "@/services/extension-local-storage";
import { PluginsStatesService } from "@/services/plugins-states";

const BaseCodeBlockWrapperHeader = memo(function BaseCodeBlockWrapperHeader() {
  const {
    codeBlock,
    sourceMessageBlockIndex,
    isHorizontalOverflowing,
    isVerticalOverflowing,
  } = useMirroredCodeBlockContext();

  const language = codeBlock?.content.language ?? null;
  const isInFlight = codeBlock?.states.isInFlight ?? false;
  const code = codeBlock?.content.code ?? "";
  const isMessageBlockInFlight = useThreadMessageBlocksDomObserverStore(
    (store) =>
      store.messageBlocks?.[sourceMessageBlockIndex]?.states.isInFlight,
    deepEqual,
  );

  const settings = ExtensionLocalStorageService.getCachedSync();
  const fineGrainedSettings = getBetterCodeBlockOptions(language);
  const globalSettings = settings.plugins["thread:betterCodeBlocks"];

  const placeholderText:
    | BetterCodeBlockFineGrainedOptions["placeholderText"]
    | undefined = fineGrainedSettings?.placeholderText;

  const isSticky =
    fineGrainedSettings?.stickyHeader ?? globalSettings.stickyHeader;
  const isBottomBarSticky =
    PluginsStatesService.getEnableStatesCachedSync()[
      "thread:betterMessageToolbars"
    ] && settings.plugins["thread:betterMessageToolbars"].sticky;

  if (!codeBlock) return null;

  return (
    <div
      className={cn(
        "x-flex x-items-center x-justify-between x-rounded-t-md x-border-b x-border-border/50 x-bg-secondary x-p-2 x-px-4 x-pb-2 x-text-muted-foreground",
        {
          "x-sticky": isSticky,
          "x-top-0": isSticky && (isMessageBlockInFlight || !isBottomBarSticky),
          "x-top-[var(--message-block-bottom-bar-height)]":
            isSticky && !isMessageBlockInFlight && isBottomBarSticky,
        },
      )}
    >
      <div className="x-flex x-items-center x-gap-2">
        <div className="x-line-clamp-1 x-font-mono x-text-sm">
          {placeholderText?.title || language}
        </div>
        {!isInFlight && placeholderText?.idle && (
          <div className="x-flex x-items-center x-gap-2">
            <Separator orientation="vertical" className="x-h-4 x-w-[2px]" />
            <div className="x-font-sans x-text-sm">{placeholderText.idle}</div>
          </div>
        )}
      </div>

      <div className="x-flex x-items-center x-gap-4">
        {isInFlight ? (
          <div className="x-flex x-items-center x-gap-2">
            {fineGrainedSettings?.placeholderText?.loading && (
              <div className="x-animate-pulse">
                {fineGrainedSettings?.placeholderText?.loading}
              </div>
            )}
            <LuLoaderCircle className="x-size-4 x-animate-spin" />
          </div>
        ) : (
          <>
            <CanvasSimpleModeRenderButton />
            {isHorizontalOverflowing && <WrapToggleButton />}
            <CopyButton content={code} />
            {isVerticalOverflowing && (
              <ExpandCollapseButton
                defaultMaxHeight={
                  fineGrainedSettings?.maxHeight.value ??
                  globalSettings.maxHeight.value
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
});

export default BaseCodeBlockWrapperHeader;
