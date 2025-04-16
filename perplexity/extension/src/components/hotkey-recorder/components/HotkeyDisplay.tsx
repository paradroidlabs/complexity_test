import { formatKeys } from "@/components/hotkey-recorder/utils";
import KeyCombo from "@/components/KeyCombo";

type HotkeyDisplayProps = {
  isRecording: boolean;
  displayKeys: string[];
  savedKeys: string[];
  onClick?: () => void;
};

export function HotkeyDisplay({
  isRecording,
  displayKeys,
  savedKeys,
  onClick,
}: HotkeyDisplayProps) {
  return (
    <div
      className={cn(
        "x:flex x:items-center x:rounded-md",
        isRecording
          ? "x:border x:border-border/50 x:bg-secondary x:px-3 x:py-1.5"
          : "x:cursor-pointer x:border-2 x:border-dashed x:border-border/50 x:px-3 x:py-1.5 x:transition-all x:hover:border-primary x:hover:bg-secondary",
      )}
      onClick={isRecording ? undefined : onClick}
    >
      {isRecording && !displayKeys.length ? (
        <div className="x:flex x:items-center x:gap-2">
          {savedKeys.length > 0 ? (
            <>
              <KeyCombo
                keys={formatKeys(savedKeys)}
                keyClassName="x:bg-secondary"
              />
              <span className="x:text-xs x:text-muted-foreground">
                Press new keys to change...
              </span>
            </>
          ) : (
            <div className="x:flex x:items-center x:gap-2 x:text-muted-foreground">
              <div className="x:h-1.5 x:w-1.5 x:animate-pulse x:rounded-full x:bg-primary" />
              Press any key...
            </div>
          )}
        </div>
      ) : (
        <div className="x:flex x:items-center x:gap-2">
          <KeyCombo
            keys={formatKeys(displayKeys)}
            keyClassName="x:bg-secondary"
          />
          {!isRecording && (
            <span
              className={cn(
                "x:font-medium x:text-muted-foreground",
                savedKeys.length > 0 && "x:text-xs",
              )}
            >
              {savedKeys.length > 0 ? "Click to edit" : "Set new keys"}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
