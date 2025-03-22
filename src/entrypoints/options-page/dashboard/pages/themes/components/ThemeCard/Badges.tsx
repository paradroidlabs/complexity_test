import { LuSun, LuMoon, LuMonitor, LuSmartphone } from "react-icons/lu";

import { Badge } from "@/components/ui/badge";

export const ColorSchemeBadge = memo(({ type }: { type: "light" | "dark" }) => {
  const Icon = type === "light" ? LuSun : LuMoon;
  return (
    <Badge variant="outline" className="x:flex x:items-center x:gap-2">
      <Icon className="x:size-3" />
      {type === "light" ? "Light" : "Dark"}
    </Badge>
  );
});

export const CompatibilityBadge = memo(
  ({ type }: { type: "desktop" | "mobile" }) => {
    const Icon = type === "desktop" ? LuMonitor : LuSmartphone;
    return (
      <Badge variant="outline" className="x:flex x:items-center x:gap-2">
        <Icon className="x:size-3" />
        {type === "desktop" ? "Desktop" : "Mobile"}
      </Badge>
    );
  },
);
