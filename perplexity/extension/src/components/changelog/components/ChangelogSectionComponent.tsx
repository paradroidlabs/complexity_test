import type { ReactNode } from "react";

export function ChangelogSectionComponent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "x:mb-8 x:border-l-3 x:border-primary/20 x:pl-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
