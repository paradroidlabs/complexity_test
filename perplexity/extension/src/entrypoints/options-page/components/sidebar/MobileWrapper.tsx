import { LuPanelLeft } from "react-icons/lu";
import { useLocation } from "react-router-dom";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { navItems } from "@/entrypoints/options-page/components/sidebar/nav-items";
import MyBreadcrumb from "@/entrypoints/options-page/dashboard/pages/plugins/components/MyBreadcrumb";

export default function MobileSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <MobileSidebarContext value={{ isOpen, setIsOpen }}>
      <Sheet open={isOpen} onOpenChange={({ open }) => setIsOpen(open)}>
        <div className="x:fixed x:top-0 x:left-0 x:z-10 x:flex x:size-max x:w-full x:cursor-pointer x:items-start x:gap-4 x:bg-background x:p-4">
          <SheetTrigger asChild>
            <LuPanelLeft className="x:my-auto x:size-4" />
          </SheetTrigger>
          <MyBreadcrumb navItems={navItems} />
        </div>
        <SheetContent side="left" className="x:h-full x:p-0">
          {children}
        </SheetContent>
      </Sheet>
    </MobileSidebarContext>
  );
}

export const MobileSidebarContext = createContext<{
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});
