import { LuSettings2 } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/data/dashboard/themes/theme.types";

type ThemeCardEditButtonProps = {
  theme: Theme;
};

export default function ThemeCardEditButton({
  theme,
}: ThemeCardEditButtonProps) {
  const navigate = useNavigate();
  return (
    <Tooltip content="Edit">
      <Button
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();

          navigate(`${theme.id}/edit`);
        }}
      >
        <LuSettings2 />
      </Button>
    </Tooltip>
  );
}
