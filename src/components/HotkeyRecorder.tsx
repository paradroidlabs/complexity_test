import { useHotkeys, useRecordHotkeys } from "react-hotkeys-hook";
import { LuCheck, LuX } from "react-icons/lu";

import KeyCombo from "@/components/KeyCombo";
import { Button } from "@/components/ui/button";
import usePlatformDetection from "@/hooks/usePlatformDetection";

const MODIFIER_KEYS = new Set(
  [Key.Meta, Key.Control, Key.Alt, Key.Shift, "ctrl"].map((k) =>
    k.toLowerCase(),
  ),
);

function orderKeys(keys: string[]): string[] {
  const modifierOrder: Record<string, number> = {
    control: 1,
    ctrl: 1,
    meta: 1,
    shift: 2,
    alt: 3,
  };

  return [...keys].sort((a, b) => {
    const aLower = a.toLowerCase();
    const bLower = b.toLowerCase();
    const aIsModifier = MODIFIER_KEYS.has(aLower);
    const bIsModifier = MODIFIER_KEYS.has(bLower);

    if (aIsModifier && bIsModifier) {
      const aOrder = modifierOrder[aLower] ?? 0;
      const bOrder = modifierOrder[bLower] ?? 0;
      return aOrder - bOrder;
    }
    if (aIsModifier) return -1;
    if (bIsModifier) return 1;
    return 0;
  });
}

function isValidKeyCombination(keys: Set<string>): boolean {
  if (!keys?.size) return false;

  const keyArray = Array.from(keys).map((k) => k.toLowerCase());
  const hasModifier = keyArray.some((k) => MODIFIER_KEYS.has(k));
  const nonModifierKeys = keyArray.filter((k) => !MODIFIER_KEYS.has(k));

  return hasModifier && nonModifierKeys.length === 1;
}

type UseHotkeyRecorderProps = {
  defaultKeys: string[];
  onSave?: (keys: string[]) => void;
};

export function useHotkeyRecorder({
  defaultKeys,
  onSave,
}: UseHotkeyRecorderProps) {
  const isMac = usePlatformDetection() === "mac";
  const [recordedKeys, { isRecording, resetKeys, start, stop }] =
    useRecordHotkeys();
  const [savedKeys, setSavedKeys] = useState<string[]>(defaultKeys);
  const [resetOnNextKeyPress, setResetOnNextKeyPress] = useState(false);

  useEffect(() => {
    setSavedKeys(defaultKeys);
  }, [defaultKeys]);

  useHotkeys(Key.Escape, () => stop(), { preventDefault: true });

  const displayKeys = isRecording
    ? recordedKeys?.size
      ? orderKeys(Array.from(recordedKeys))
      : []
    : orderKeys(savedKeys);

  useEffect(() => {
    const handleKeyUp = () => {
      if (resetOnNextKeyPress) {
        resetKeys();
        setResetOnNextKeyPress(false);
      }
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  useEffect(() => {
    if (!recordedKeys?.size) return;
    setResetOnNextKeyPress(true);
  }, [recordedKeys]);

  // useEffect(() => {
  //   if (!recordedKeys?.size) return;

  //   const nonModifierKeys = Array.from(recordedKeys)
  //     .map((k) => k.toLowerCase())
  //     .filter((k) => !MODIFIER_KEYS.has(k));

  //   if (nonModifierKeys.length > 1) {
  //     resetKeys();
  //     stop();
  //   }
  // }, [recordedKeys, resetKeys, stop]);

  const handleStartRecording = () => {
    if (!isRecording) {
      resetKeys();
      start();
    }
  };

  const handleStopRecording = () => {
    if (!isValidKeyCombination(recordedKeys)) {
      resetKeys();
    } else if (onSave && recordedKeys != null) {
      const orderedKeys = orderKeys(Array.from(recordedKeys));
      setSavedKeys(orderedKeys);
      onSave(orderedKeys);
    }
    stop();
  };

  const isValidCombination =
    recordedKeys != null ? isValidKeyCombination(recordedKeys) : true;

  const HotkeyRecorderUI = () => (
    <div className="x:flex x:flex-col x:gap-3">
      <div className="x:flex x:items-center x:gap-3">
        {isRecording && (
          <>
            <Button
              size="icon"
              onClick={() => {
                resetKeys();
                stop();
              }}
            >
              <LuX />
            </Button>
            <Button
              disabled={!isValidCombination}
              size="icon"
              onClick={handleStopRecording}
            >
              <LuCheck />
            </Button>
          </>
        )}
        <div
          className={
            "x:flex x:items-center x:rounded-md " +
            (isRecording
              ? "x:border x:border-border/50 x:bg-secondary x:px-3 x:py-1.5"
              : "x:cursor-pointer x:border-2 x:border-dashed x:border-border/50 x:px-3 x:py-1.5 x:transition-all x:hover:border-primary x:hover:bg-secondary")
          }
          onClick={isRecording ? undefined : handleStartRecording}
        >
          {isRecording && !recordedKeys?.size ? (
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
      </div>
      {isRecording && !isValidCombination && recordedKeys?.size > 0 && (
        <div className="x:flex x:items-center x:gap-2 x:text-sm x:font-medium x:text-destructive">
          Invalid combination. Use at least one modifier key (
          {isMac ? "⌘" : "Ctrl"}, {isMac ? "⌥" : "Alt"}, {isMac ? "⇧" : "Shift"}
          ), combined with one regular key
        </div>
      )}
    </div>
  );

  return {
    HotkeyRecorderUI,
    isRecording,
    keys: recordedKeys != null ? orderKeys(Array.from(recordedKeys)) : [],
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
    isValidCombination,
  };
}

export function formatKeys(keys: string[]): string[] {
  return keys.map((key) => key.charAt(0).toUpperCase() + key.slice(1));
}
