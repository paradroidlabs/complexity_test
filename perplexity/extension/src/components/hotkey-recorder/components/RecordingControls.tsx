import { LuCheck, LuX } from "react-icons/lu";

import { Button } from "@/components/ui/button";

type RecordingControlsProps = {
  isValidCombination: boolean;
  onCancel: () => void;
  onSave: () => void;
};

export function RecordingControls({
  isValidCombination,
  onCancel,
  onSave,
}: RecordingControlsProps) {
  return (
    <>
      <Button size="icon" onClick={onCancel}>
        <LuX />
      </Button>
      <Button disabled={!isValidCombination} size="icon" onClick={onSave}>
        <LuCheck />
      </Button>
    </>
  );
}
