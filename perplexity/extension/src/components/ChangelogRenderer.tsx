import type { HTMLAttributes, ComponentPropsWithoutRef } from "react";

import LegacyChangelogItemsBlock from "@/components/LegacyChangelogItemsBlock";
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
    img: ({ src, alt }: { src?: string; alt?: string }) => (
      <img
        src={src}
        alt={alt}
        className="x:rounded-md x:border x:border-border/50"
      />
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="x:mt-2 x:text-2xl x:font-semibold x:text-primary x:capitalize">
        {children}
      </h2>
    ),
    "items-block": LegacyChangelogItemsBlock,
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
