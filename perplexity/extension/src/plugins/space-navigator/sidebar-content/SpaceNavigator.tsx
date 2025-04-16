import type { PopoverRootProps } from "@ark-ui/react";
import { LuSearch } from "react-icons/lu";

import Tooltip from "@/components/Tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SpaceNavigatorContent from "@/plugins/space-navigator/SpaceNavigatorContent";

type SpaceNavigator = PopoverRootProps;

export default function SpaceNavigator({ ...props }: SpaceNavigator) {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      lazyMount={false}
      unmountOnExit={false}
      positioning={{
        placement: "right-start",
        gutter: 20,
      }}
      open={open}
      onOpenChange={({ open }) => setOpen(open)}
      {...props}
    >
      <Tooltip
        content={t("plugin-space-navigator:spaceNavigator.button.label")}
      >
        <PopoverTrigger asChild>
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen((prev) => !prev);
            }}
          >
            <div className="x:flex x:size-6 x:items-center x:justify-center x:text-muted-foreground x:transition-all x:group-hover:text-foreground x:hover:bg-black/5 x:dark:hover:bg-white/5">
              <LuSearch />
            </div>
          </div>
        </PopoverTrigger>
      </Tooltip>
      <PopoverContent className="x:p-0">
        <SpaceNavigatorContent setOpen={setOpen} />
      </PopoverContent>
    </Popover>
  );
}
