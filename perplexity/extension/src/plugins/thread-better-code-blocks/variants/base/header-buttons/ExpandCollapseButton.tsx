import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

type ExpandCollapseButtonProps = {
  defaultMaxHeight: number;
};

export function ExpandCollapseButton({
  defaultMaxHeight,
}: ExpandCollapseButtonProps) {
  const { maxHeight, setMaxHeight } = useMirroredCodeBlockContext();

  return (
    <Tooltip
      content={
        maxHeight === defaultMaxHeight
          ? t("plugin-better-code-blocks:headerButtons.expand.expand")
          : t("plugin-better-code-blocks:headerButtons.expand.collapse")
      }
    >
      <div
        className="x:cursor-pointer x:text-muted-foreground x:transition-colors x:hover:text-foreground"
        onClick={() =>
          setMaxHeight(maxHeight === defaultMaxHeight ? 9999 : defaultMaxHeight)
        }
      >
        {maxHeight === defaultMaxHeight ? (
          <LuChevronDown className="x:size-4" />
        ) : (
          <LuChevronUp className="x:size-4" />
        )}
      </div>
    </Tooltip>
  );
}
