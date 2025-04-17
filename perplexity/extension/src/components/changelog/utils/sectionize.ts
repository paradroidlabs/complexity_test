import type { Root, Heading } from "mdast";

import type { CustomContent } from "@/components/changelog/types";

export function sectionize() {
  return (tree: Root) => {
    const newContent: CustomContent[] = [];
    let currentSection: typeof tree.children = [];
    let seenH2 = false;

    const children = [...tree.children];
    const beforeFirstH2: typeof tree.children = [];

    for (let i = 0; i < children.length; i++) {
      const node = children[i];

      if (
        node != null &&
        node.type === "heading" &&
        (node as Heading).depth === 2
      ) {
        if (seenH2) {
          newContent.push({
            type: "section",
            children: currentSection,
            data: {
              hName: "div",
              hProperties: { className: "changelog-section" },
            },
          });
        } else if (beforeFirstH2.length > 0) {
          newContent.push(...beforeFirstH2);
        }

        currentSection = [node];
        seenH2 = true;
      } else if (seenH2 && node != null) {
        currentSection.push(node);
      } else if (node != null) {
        beforeFirstH2.push(node);
      }
    }

    if (seenH2 && currentSection.length > 0) {
      newContent.push({
        type: "section",
        children: currentSection,
        data: { hName: "div", hProperties: { className: "changelog-section" } },
      });
    } else if (beforeFirstH2.length > 0) {
      newContent.push(...beforeFirstH2);
    }

    tree.children = newContent as unknown as typeof tree.children;
  };
}
