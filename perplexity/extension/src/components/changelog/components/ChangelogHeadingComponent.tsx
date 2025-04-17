import type { ReactNode } from "react";

export function ChangelogHeadingComponent({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <h2 className="x:mt-2 x:text-2xl x:font-semibold x:text-primary x:capitalize">
      {children}
    </h2>
  );
}
