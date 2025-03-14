import { HTMLProps, useMemo } from "react";

import usePlatformDetection from "@/hooks/usePlatformDetection";

export default function KeyCombo({
  keys,
  keyClassName,
  className,
  ...props
}: HTMLProps<HTMLSpanElement> & {
  keys: string[];
  keyClassName?: string;
}) {
  const isMac = usePlatformDetection() === "mac";

  const processedKeys = useMemo(() => {
    return keys.map((key) => {
      switch (key.toLowerCase()) {
        case "ctrl":
        case "control":
          return isMac ? "⌘" : "Ctrl";
        case "alt":
          return isMac ? "⌥" : "Alt";
        case "shift":
          return "⇧";
        default:
          return key;
      }
    });
  }, [keys, isMac]);

  if (keys.length === 0) return null;

  return (
    <span className={cn("x:inline-flex x:gap-1", className)} {...props}>
      {processedKeys.map((key, idx) => (
        <span
          key={idx}
          className={cn(
            "x:rounded-sm x:border x:border-border/50 x:px-1 x:font-mono x:font-medium x:text-muted-foreground",
            keyClassName,
          )}
        >
          {key}
        </span>
      ))}
    </span>
  );
}
