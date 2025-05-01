import { LuPencil } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

import Tooltip from "@/components/Tooltip";
import { Button } from "@/components/ui/button";
import type { Theme } from "@/plugins/_core/custom-theme/themes/theme-registry.types";

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
        onClick={() => navigate(`${theme.id}/edit`)}
      >
        <LuPencil />
      </Button>
    </Tooltip>
  );
}
