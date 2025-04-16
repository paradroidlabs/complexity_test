import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import LoadingOverlay from "@/components/LoadingOverlay";
import DesktopSidebarWrapper from "@/entrypoints/options-page/components/sidebar/DesktopWrapper";
import MobileSidebarWrapper from "@/entrypoints/options-page/components/sidebar/MobileWrapper";
import Sidebar from "@/entrypoints/options-page/components/sidebar/Sidebar";
import { useIsMobileStore } from "@/hooks/use-is-mobile-store";

export function Dashboard() {
  const { isMobile } = useIsMobileStore();
  const SidebarWrapper = isMobile
    ? MobileSidebarWrapper
    : DesktopSidebarWrapper;

  return (
    <div className="x:flex x:min-h-screen x:bg-background">
      <SidebarWrapper>
        <Sidebar />
      </SidebarWrapper>

      <div className="x:flex x:flex-1 x:flex-col x:gap-4">
        <main className="x:mx-auto x:mt-11 x:min-h-[100dvh] x:w-full x:max-w-[1800px] x:p-4 x:md:mt-0">
          <Suspense fallback={<LoadingOverlay />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
