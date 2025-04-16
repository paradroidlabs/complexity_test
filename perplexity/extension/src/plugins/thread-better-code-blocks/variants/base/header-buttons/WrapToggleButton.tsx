import { LuAlignJustify, LuWrapText } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import { useMirroredCodeBlockContext } from "@/plugins/thread-better-code-blocks/MirroredCodeBlockContext";

export function WrapToggleButton() {
  const { isWrapped, setIsWrapped } = useMirroredCodeBlockContext();

  return (
    <Tooltip
      content={
        isWrapped
          ? t("plugin-better-code-blocks:headerButtons.wrap.unwrap")
          : t("plugin-better-code-blocks:headerButtons.wrap.wrap")
      }
    >
      <div
        className="x:cursor-pointer x:text-muted-foreground x:transition-colors x:hover:text-foreground"
        onClick={() => setIsWrapped(!isWrapped)}
      >
        {isWrapped ? (
          <LuAlignJustify className="x:size-4" />
        ) : (
          <LuWrapText className="x:size-4" />
        )}
      </div>
    </Tooltip>
  );
}
