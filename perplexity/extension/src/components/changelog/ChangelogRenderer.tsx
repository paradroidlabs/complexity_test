import type { HTMLAttributes } from "react";

import { ChangelogContextAwareImageComponent } from "@/components/changelog/components/ChangelogContextAwareImageComponent";
import { ChangelogHeadingComponent } from "@/components/changelog/components/ChangelogHeadingComponent";
import { ChangelogImageCollectionComponent } from "@/components/changelog/components/ChangelogImageCollectionComponent";
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
    div: (props) => {
      if (props.className === "changelog-section") {
        return (
          <ChangelogSectionComponent>
            {props.children}
          </ChangelogSectionComponent>
        );
      }
      return <div {...props} />;
    },
    img: ChangelogContextAwareImageComponent,
    h2: ChangelogHeadingComponent,
    "items-block": LegacyChangelogItemsBlock,
    "img-collection": ChangelogImageCollectionComponent,
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
