import { HTMLAttributes, ComponentPropsWithoutRef } from "react";

import ChangelogItemsBlock from "@/components/ChangelogItemsBlock";
import MarkdownRenderer from "@/components/MarkdownRenderer";

type ChangelogComponents = ComponentPropsWithoutRef<
  typeof MarkdownRenderer
>["components"];

export default function ChangelogRenderer({
  changelog,
  className,
  ...props
}: {
  changelog: string;
} & HTMLAttributes<HTMLDivElement>) {
  const changelogComponents = {
    "items-block": ChangelogItemsBlock,
    link: () => <div />,
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <img
        src={src}
        alt={alt}
        className="x-max-w-[1000px] x-rounded-md x-border x-border-border/50"
      />
    ),
  } as ChangelogComponents;

  return (
    <MarkdownRenderer
      markdown={changelog}
      components={changelogComponents}
      className={className}
      {...props}
    />
  );
}
