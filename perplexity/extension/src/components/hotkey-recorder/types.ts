export type UseHotkeyRecorderProps = {
  defaultKeys: string[];
  onSave?: (keys: string[]) => void;
};

export type HotkeyRecorderReturn = {
  HotkeyRecorderUi: () => React.ReactNode;
  isRecording: boolean;
  keys: string[];
  startRecording: () => void;
  stopRecording: () => void;
  isValidCombination: boolean;
};
