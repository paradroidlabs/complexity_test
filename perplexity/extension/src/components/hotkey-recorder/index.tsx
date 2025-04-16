import { HotkeyRecorderUi } from "@/components/hotkey-recorder/components/HotkeyRecorderUi";
import type {
  UseHotkeyRecorderProps,
  HotkeyRecorderReturn,
} from "@/components/hotkey-recorder/types";
import {
  MODIFIER_KEYS,
  isValidKeyCombination,
  orderKeys,
  normalizeKeyName,
} from "@/components/hotkey-recorder/utils";
import { getPlatform } from "@/hooks/usePlatformDetection";

export function useHotkeyRecorder({
  defaultKeys,
  onSave,
}: UseHotkeyRecorderProps): HotkeyRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedKeys, setRecordedKeys] = useState<Set<string>>(new Set());
  const [savedKeys, setSavedKeys] = useState<string[]>(defaultKeys);
  const [showError, setShowError] = useState(false);

  const keydownHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);
  const keyupHandlerRef = useRef<((e: KeyboardEvent) => void) | null>(null);
  const activeKeysRef = useRef<Set<string>>(new Set());
  const recordedKeysRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    setSavedKeys(defaultKeys);
  }, [defaultKeys]);

  useEffect(() => {
    recordedKeysRef.current = recordedKeys;
  }, [recordedKeys]);

  const displayKeys = isRecording
    ? recordedKeys?.size
      ? orderKeys(Array.from(recordedKeys))
      : []
    : orderKeys(savedKeys);

  const resetKeys = useCallback(() => {
    setRecordedKeys(new Set());
    activeKeysRef.current = new Set();
    setShowError(false);
  }, []);

  const start = useCallback(() => {
    setIsRecording(true);
    resetKeys();

    const keydownHandler = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const keyName = normalizeKeyName(e.key);

      const isWindows = getPlatform() === "windows";
      if (isWindows && keyName === "Meta") {
        return;
      }

      activeKeysRef.current.add(keyName);
      setRecordedKeys(new Set(activeKeysRef.current));
    };

    const keyupHandler = (e: KeyboardEvent) => {
      const keyName = normalizeKeyName(e.key);
      activeKeysRef.current.delete(keyName);

      if (
        activeKeysRef.current.size === 0 &&
        recordedKeysRef.current.size > 0
      ) {
        const isValid = isValidKeyCombination(recordedKeysRef.current);
        setShowError(!isValid);
      }
    };

    keydownHandlerRef.current = keydownHandler;
    keyupHandlerRef.current = keyupHandler;
    window.addEventListener("keydown", keydownHandler);
    window.addEventListener("keyup", keyupHandler);
  }, [resetKeys]);

  const stop = useCallback(() => {
    setIsRecording(false);

    if (keydownHandlerRef.current) {
      window.removeEventListener("keydown", keydownHandlerRef.current);
      keydownHandlerRef.current = null;
    }

    if (keyupHandlerRef.current) {
      window.removeEventListener("keyup", keyupHandlerRef.current);
      keyupHandlerRef.current = null;
    }

    activeKeysRef.current = new Set();
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (isRecording && e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        stop();
      }
    };

    if (isRecording) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isRecording, stop]);

  useEffect(() => {
    if (!recordedKeys?.size) return;

    const nonModifierKeys = Array.from(recordedKeys)
      .map((k) => k.toLowerCase())
      .filter((k) => !MODIFIER_KEYS.has(k));

    if (nonModifierKeys.length > 1) {
      resetKeys();
      stop();
    }
  }, [recordedKeys, resetKeys, stop]);

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

  useEffect(() => {
    return () => {
      if (keydownHandlerRef.current) {
        window.removeEventListener("keydown", keydownHandlerRef.current);
      }
      if (keyupHandlerRef.current) {
        window.removeEventListener("keyup", keyupHandlerRef.current);
      }
    };
  }, []);

  const HotkeyRecorderComponent = () => (
    <HotkeyRecorderUi
      isRecording={isRecording}
      recordedKeys={recordedKeys}
      savedKeys={savedKeys}
      displayKeys={displayKeys}
      isValidCombination={isValidCombination}
      handleStartRecording={handleStartRecording}
      handleStopRecording={handleStopRecording}
      resetKeys={resetKeys}
      stop={stop}
      showError={showError}
    />
  );

  return {
    HotkeyRecorderUi: HotkeyRecorderComponent,
    isRecording,
    keys: recordedKeys != null ? orderKeys(Array.from(recordedKeys)) : [],
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
    isValidCombination,
  };
}
