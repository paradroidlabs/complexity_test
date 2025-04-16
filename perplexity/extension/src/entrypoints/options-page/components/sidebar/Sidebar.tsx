import { Trans } from "react-i18next";
import { LuExternalLink } from "react-icons/lu";
import { NavLink } from "react-router-dom";

import SponsorDialogWrapper from "@/components/SponsorDialogWrapper";
import { MobileSidebarContext } from "@/entrypoints/options-page/components/sidebar/MobileWrapper";
import { navItems } from "@/entrypoints/options-page/components/sidebar/nav-items";
import Version from "@/entrypoints/options-page/components/sidebar/Version";
import SidebarUpdateAnnouncer from "@/entrypoints/options-page/components/SidebarUpdateAnnouncer";

export default function Sidebar() {
  const { setIsOpen } = use(MobileSidebarContext);

  return (
    <div className="x:sticky x:top-0 x:flex x:h-full x:flex-col x:justify-between x:md:h-screen">
      <div className="x:overflow-y-auto x:p-4 x:px-2">
        <Version />
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              cn(
                "x:mb-1 x:flex x:items-center x:rounded-md x:p-2 x:px-4 x:text-sm x:font-medium x:transition-all",
                {
                  "x:bg-primary-foreground x:text-primary": isActive,
                  "x:text-muted-foreground x:hover:text-foreground": !isActive,
                },
              )
            }
          >
            <Icon className="x:mr-2 x:size-4" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>

      <div className="x:sticky x:bottom-0 x:z-10 x:flex x:shrink-0 x:flex-col x:gap-4 x:bg-background x:p-4">
        <SidebarUpdateAnnouncer />

        <SponsorDialogWrapper>
          <div
            className="x:group x:relative x:w-full x:cursor-pointer x:rounded-md x:border x:border-border/50 x:bg-secondary x:p-4 x:text-sm x:font-medium x:shadow-lg x:transition-all x:hover:scale-105 x:hover:border-primary x:hover:bg-primary/10 x:md:text-balance"
            onClick={() => {
              setIsOpen(false);
            }}
          >
            <Trans
              i18nKey="sidebar.supporterMessage"
              components={{
                emphasis: (
                  <span
                    key="sidebar.supporterMessage"
                    className="x:font-medium x:text-primary"
                  />
                ),
              }}
            />
            <LuExternalLink className="x:absolute x:top-2 x:right-2 x:size-3.5 x:text-muted x:group-hover:text-primary" />
          </div>
        </SponsorDialogWrapper>
      </div>
    </div>
  );
}
