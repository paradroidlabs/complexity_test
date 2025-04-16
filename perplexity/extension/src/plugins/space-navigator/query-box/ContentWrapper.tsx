import Tooltip from "@/components/Tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SpaceNavigatorContent from "@/plugins/space-navigator/SpaceNavigatorContent";

type SpaceNavigatorMobileContentWrapperProps = {
  children: React.ReactNode;
};

export default function SpaceNavigatorMobileContentWrapper({
  children,
}: SpaceNavigatorMobileContentWrapperProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet lazyMount open={open} onOpenChange={({ open }) => setOpen(open)}>
      <Tooltip
        content={t("plugin-space-navigator:spaceNavigator.button.label")}
      >
        <SheetTrigger asChild>{children}</SheetTrigger>
      </Tooltip>
      <SheetContent side="bottom" className="x:p-0">
        <SpaceNavigatorContent setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}
