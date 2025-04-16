import type { BetterCodeBlockFineGrainedOptions } from "@/data/dashboard/better-code-blocks/better-code-blocks-options.types";
import type { CodeBlock } from "@/plugins/_core/dom-observers/thread/code-blocks/types";
import { betterCodeBlocksFineGrainedOptionsQueries } from "@/services/indexed-db/better-code-blocks/query-keys";
import { INTERNAL_ATTRIBUTES } from "@/utils/dom-selectors";
import { queryClient } from "@/utils/ts-query-client";

export function createMirroredPortalContainer(
  codeBlock: CodeBlock,
  codeBlockIndex: number,
): HTMLElement | null {
  if (!codeBlock.nodes.$wrapper) return null;

  const $existingPortalContainer = codeBlock.nodes.$wrapper.prev();

  if (
    $existingPortalContainer[0] &&
    $existingPortalContainer.internalComponentAttr() ===
      INTERNAL_ATTRIBUTES.THREAD.MESSAGE.MIRRORED_CODE_BLOCK
  ) {
    return $existingPortalContainer[0];
  }

  const $portalContainer = $("<div>")
    .internalComponentAttr(
      INTERNAL_ATTRIBUTES.THREAD.MESSAGE.MIRRORED_CODE_BLOCK,
    )
    .attr({
      "data-language": codeBlock.content.language,
      "data-index": codeBlockIndex,
    });

  codeBlock.nodes.$wrapper.before($portalContainer);

  return $portalContainer[0]!;
}

export function getBetterCodeBlockOptions(
  language: string | null,
): BetterCodeBlockFineGrainedOptions | undefined | null {
  const fineGrainedSettings = language
    ? queryClient
        .getQueryData<
          BetterCodeBlockFineGrainedOptions[]
        >(betterCodeBlocksFineGrainedOptionsQueries.list.queryKey)
        ?.find((option) => option.language === language)
    : null;

  return fineGrainedSettings;
}
