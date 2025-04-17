import type { HTMLAttributes, ReactNode } from "react";

import { ChangelogHeadingComponent } from "@/components/changelog/components/ChangelogHeadingComponent";
import { ChangelogImageComponent } from "@/components/changelog/components/ChangelogImageComponent";
import { ChangelogSectionComponent } from "@/components/changelog/components/ChangelogSectionComponent";
import LegacyChangelogItemsBlock from "@/components/changelog/components/LegacyChangelogItemsBlock";
import type { ChangelogComponents } from "@/components/changelog/types";
import { sectionize } from "@/components/changelog/utils/sectionize";
import MarkdownRenderer from "@/components/MarkdownRenderer";

export default function ChangelogRenderer({
  changelog,
  className,
  ...props
}: {
  changelog: string;
} & HTMLAttributes<HTMLDivElement>) {
  const changelogComponents = {
    div: (props: { children: ReactNode; className?: string }) => {
      if (props.className === "changelog-section") {
        return (
          <ChangelogSectionComponent>
            {props.children}
          </ChangelogSectionComponent>
        );
      }
      return <div {...props} />;
    },
    img: ChangelogImageComponent,
    h2: ChangelogHeadingComponent,
    "items-block": LegacyChangelogItemsBlock,
  } as ChangelogComponents;

  return (
    <MarkdownRenderer
      markdown={changelog}
      components={changelogComponents}
      className={className}
      remarkPlugins={[sectionize]}
      {...props}
    />
  );
}
