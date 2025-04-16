import type { HTMLAttributes } from "react";

const HEADER_TEXT = {
  new: "What's New",
  "bug-fix": "Bug Fixes",
  improvement: "Improvements",
  change: "Changes",
};

export default function LegacyChangelogItemsBlock({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  "data-variant"?: string;
}) {
  const headerText = props["data-variant"]
    ? HEADER_TEXT[props["data-variant"] as keyof typeof HEADER_TEXT] ||
      props["data-variant"]
    : null;

  return (
    <div className={cn(className)} {...props}>
      <h2 className="x:mt-2 x:text-2xl x:font-semibold x:text-primary x:capitalize">
        {headerText}
      </h2>
      {children}
    </div>
  );
}
