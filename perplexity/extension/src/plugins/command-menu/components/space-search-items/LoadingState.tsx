import { LuLoaderCircle } from "react-icons/lu";

export function LoadingState() {
  return (
    <div className="x:flex x:animate-pulse x:items-center x:justify-center x:gap-2 x:p-4 x:text-sm x:text-muted-foreground">
      <LuLoaderCircle className="x:size-4 x:animate-spin" />
      <span>{t("plugin-command-menu:commandMenu.spaceSearch.loading")}</span>
    </div>
  );
}
