import PplxRewrite from "@/components/icons/PplxRewrite";
import Tooltip from "@/components/Tooltip";
import { handleInstantRewrite } from "@/plugins/instant-rewrite-button/handle-instant-rewrite";

export default function InstantRewriteButton({
  messageBlockIndex,
}: {
  messageBlockIndex: number;
}) {
  return (
    <Tooltip content={t("misc.instantRewrite")}>
      <button
        className="x-flex x-items-center x-gap-1 x-rounded-md x-p-1 x-px-2 x-text-xs x-font-medium x-text-muted-foreground x-transition-all hover:x-bg-secondary active:x-scale-95"
        onClick={() => handleInstantRewrite({ messageBlockIndex })}
      >
        <PplxRewrite className="x-size-4" />
      </button>
    </Tooltip>
  );
}
