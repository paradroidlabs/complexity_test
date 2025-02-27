import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes } from "react";
import { LuArrowLeftRight, LuRocket, LuSparkles } from "react-icons/lu";
import { TbBugOff } from "react-icons/tb";

const blockVariants = cva("x-my-2 x-rounded-md x-p-4", {
  variants: {
    variant: {
      new: "x-bg-primary/10 [&_[data-releasenote-part='header']]:x-text-primary [&_strong]:x-text-foreground",
      "bug-fix":
        "x-bg-success/10 [&_[data-releasenote-part='header']]:x-text-success [&_strong]:x-text-success-foreground",
      improvement:
        "x-bg-success/10 [&_[data-releasenote-part='header']]:x-text-success [&_strong]:x-text-success-foreground",
      change: "x-bg-secondary x-text-foreground",
    },
  },
  defaultVariants: {
    variant: "new",
  },
});

const ICON = {
  new: LuSparkles,
  "bug-fix": TbBugOff,
  improvement: LuRocket,
  change: LuArrowLeftRight,
};

const HEADER_TEXT = {
  new: "What's New",
  "bug-fix": "Bug Fixes",
  improvement: "Improvements",
  change: "Changes",
};

export default function NewItems({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  "data-description"?: string;
  "data-variant"?: VariantProps<typeof blockVariants>["variant"];
}) {
  const Icon = props["data-variant"] ? ICON[props["data-variant"]] : null;
  const headerText = props["data-variant"]
    ? HEADER_TEXT[props["data-variant"]]
    : null;

  return (
    <div
      data-release-note-part="wrapper"
      className={cn(
        blockVariants({ variant: props["data-variant"] }),
        className,
      )}
      {...props}
    >
      <div className="x-flex x-flex-col x-gap-2">
        <div
          className="x-flex x-items-center x-gap-2"
          data-releasenote-part="header"
        >
          {Icon && <Icon className="x-size-8" />}
          <span className="x-text-2xl x-font-semibold x-uppercase">
            {headerText}
          </span>
        </div>
        {props["data-description"] && (
          <span className="x-ml-8 x-text-sm x-text-muted-foreground">
            {props["data-description"]}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
