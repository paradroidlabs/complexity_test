import type { RootContent } from "mdast";
import type { ComponentPropsWithoutRef } from "react";

import type MarkdownRenderer from "@/components/MarkdownRenderer";

export type ChangelogComponents = ComponentPropsWithoutRef<
  typeof MarkdownRenderer
>["components"];

export type CustomContent =
  | RootContent
  | {
      type: "section";
      children: RootContent[];
      data: {
        hName: string;
        hProperties: { className: string };
      };
    };
