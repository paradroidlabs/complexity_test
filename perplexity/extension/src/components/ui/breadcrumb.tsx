import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps } from "react";
import { type ReactNode } from "react";
import { LuChevronRight, LuEllipsis } from "react-icons/lu";

type BreadcrumbProps = ComponentProps<"nav"> & {
  separator?: ReactNode;
  collapsed?: boolean;
};

const Breadcrumb = ({
  collapsed = true,
  className,
  ...props
}: BreadcrumbProps) => (
  <nav
    aria-label="breadcrumb"
    data-collapsed={collapsed}
    className={cn("x:w-full x:overflow-hidden", className)}
    {...props}
  />
);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = ({ className, ...props }: ComponentProps<"ol">) => (
  <ol
    className={cn(
      "x:flex x:items-center x:gap-1.5 x:text-sm x:text-muted-foreground",
      className,
    )}
    {...props}
  />
);
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = ({ className, ...props }: ComponentProps<"li">) => (
  <li
    data-item=""
    className={cn("x:flex x:shrink-0 x:items-center", className)}
    {...props}
  />
);
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = ({
  asChild,
  className,
  ...props
}: ComponentProps<"a"> & {
  asChild?: boolean;
}) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      className={cn("x:transition-colors x:hover:text-foreground", className)}
      {...props}
    />
  );
};
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = ({ className, ...props }: ComponentProps<"span">) => (
  <span
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("x:font-normal x:text-foreground", className)}
    {...props}
  />
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    data-separator=""
    className={cn("x:[&>svg]:h-3.5 x:[&>svg]:w-3.5", className)}
    {...props}
  >
    {children ?? <LuChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      "x:flex x:h-9 x:w-9 x:items-center x:justify-center",
      className,
    )}
    {...props}
  >
    <LuEllipsis className="x:h-4 x:w-4" />
    <span className="x:sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
